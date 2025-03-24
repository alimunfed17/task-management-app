import React from 'react';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Task } from '../api/tasksApi';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: 'Pending' | 'In Progress' | 'Completed') => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-gray-900 truncate">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm flex-grow">
        {task.description || 'No description provided.'}
      </p>
      
      {task.due_date && (
        <div className="text-sm text-gray-500 mb-4">
          Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id.toString(), e.target.value as 'Pending' | 'In Progress' | 'Completed')}
            className="text-sm rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/tasks/$taskId/edit`}
            params={{ taskId: task.id.toString() }}
            className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(task.id.toString())}
            className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 