import axios from 'axios';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'Pending' | 'In Progress' | 'Completed';
  due_date: string | null;
  user_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: 'Pending' | 'In Progress' | 'Completed';
  due_date?: string | null;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: 'Pending' | 'In Progress' | 'Completed';
  due_date?: string | null;
}

// Use relative URL to ensure all requests go through the Vite proxy
const API_URL = '/api/v1/tasks/';

// Helper function to ensure we have the auth token in headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Using token for auth:', token ? 'Token exists' : 'No token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

export const tasksApi = {
  // Get all tasks
  async getTasks(status?: string): Promise<Task[]> {
    try {
      const params = status ? { status } : {};
      const headers = getAuthHeaders();
      console.log('Getting tasks with headers:', headers);
      
      const response = await axios.get(API_URL, { 
        params,
        ...headers
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },

  // Get a task by ID
  async getTask(id: string): Promise<Task> {
    try {
      const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new task
  async createTask(task: CreateTaskPayload): Promise<Task> {
    try {
      // Log the token for debugging
      const headers = getAuthHeaders();
      console.log('Creating task with auth headers:', headers);
      
      const response = await axios.post(API_URL, task, headers);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      throw error;
    }
  },

  // Update a task
  async updateTask(id: string, task: UpdateTaskPayload): Promise<Task> {
    try {
      const response = await axios.put(`${API_URL}/${id}`, task, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(id: string): Promise<Task> {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  },
}; 