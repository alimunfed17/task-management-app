import React from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, UpdateTaskPayload } from '../api/tasksApi';
import TaskForm from '../components/TaskForm';
import { taskEditRoute } from '../routes/route-tree';

const TaskEditPage: React.FC = () => {
  // Get params from the matched route
  const { taskId } = taskEditRoute.useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Fetch task details
  const { data: task, isLoading, isError } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => tasksApi.getTask(taskId),
  });
  
  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: (data: UpdateTaskPayload) => tasksApi.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      navigate({ to: '/dashboard' });
    },
  });
  
  const handleSubmit = (data: UpdateTaskPayload) => {
    updateTaskMutation.mutate(data);
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Loading task details...</p>
      </div>
    );
  }
  
  if (isError || !task) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Error loading task. The task may not exist or you don't have permission to view it.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => navigate({ to: '/dashboard' })}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Task</h1>
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <TaskForm
          initialData={{
            title: task.title,
            description: task.description || undefined,
            status: task.status,
            due_date: task.due_date,
          }}
          onSubmit={handleSubmit}
          isLoading={updateTaskMutation.isPending}
        />
      </div>
    </div>
  );
};

export default TaskEditPage; 