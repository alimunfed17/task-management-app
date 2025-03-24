import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { tasksApi, Task, CreateTaskPayload } from '@/api/tasksApi';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const DashboardPage: React.FC = () => {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Fetch tasks with TanStack Query
  const { data: tasks, isLoading, isError, error } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => tasksApi.getTasks(filter),
  });
  
  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowCreateForm(false);
    },
  });
  
  // Delete task mutation with optimistic updates
  const deleteTaskMutation = useMutation({
    mutationFn: tasksApi.deleteTask,
    onMutate: async (taskId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Save current tasks
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', filter]);
      
      // Optimistically update the UI
      queryClient.setQueryData(['tasks', filter], (old: Task[] | undefined) => {
        return old ? old.filter(task => task.id !== Number(taskId)) : [];
      });
      
      return { previousTasks };
    },
    onError: (_err, _taskId, context) => {
      // Roll back to previous state on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', filter], context.previousTasks);
      }
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  // Update task mutation - moved to top level
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: 'Pending' | 'In Progress' | 'Completed' } }) => 
      tasksApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  const handleStatusChange = (taskId: string, status: 'Pending' | 'In Progress' | 'Completed') => {
    updateTaskMutation.mutate({ id: taskId, data: { status } });
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Tasks</h1>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showCreateForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>
      
      {showCreateForm && (
        <div className="mb-6 p-4 bg-white rounded-md shadow">
          <h2 className="text-lg font-medium mb-4">Create New Task</h2>
          <TaskForm 
            onSubmit={(data) => {
              // Ensure it's a CreateTaskPayload by ensuring title is present
              if (data.title) {
                createTaskMutation.mutate(data as CreateTaskPayload);
              }
            }}
            isLoading={createTaskMutation.isPending}
          />
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter(undefined)}
            className={`px-3 py-1 rounded-md ${!filter ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Pending')}
            className={`px-3 py-1 rounded-md ${filter === 'Pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('In Progress')}
            className={`px-3 py-1 rounded-md ${filter === 'In Progress' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('Completed')}
            className={`px-3 py-1 rounded-md ${filter === 'Completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-red-600">Error loading tasks: {(error as Error).message}</p>
        </div>
      ) : tasks?.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-md shadow">
          <p className="text-gray-600">No tasks found. Create a new task to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 