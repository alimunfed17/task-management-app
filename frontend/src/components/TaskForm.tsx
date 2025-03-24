import React, { useState } from 'react';
import { format } from 'date-fns';
import { CreateTaskPayload, UpdateTaskPayload } from '../api/tasksApi';

interface TaskFormProps {
  initialData?: {
    title: string;
    description?: string;
    status?: 'Pending' | 'In Progress' | 'Completed';
    due_date?: string | null;
  };
  onSubmit: (data: CreateTaskPayload | UpdateTaskPayload) => void;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>(
    initialData?.status || 'Pending'
  );
  const [dueDate, setDueDate] = useState<string>(
    initialData?.due_date 
      ? format(new Date(initialData.due_date), 'yyyy-MM-dd')
      : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: CreateTaskPayload = {
      title,
      description: description || undefined,
      status,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Task title"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Task description (optional)"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Pending' | 'In Progress' | 'Completed')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            id="due_date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm; 