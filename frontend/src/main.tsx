import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

import './styles/index.css';
import { routeTree } from './routes/route-tree';

// Set up axios defaults for authentication
const token = localStorage.getItem('token');
if (token) {
  console.log('Setting authorization token in axios defaults on app startup');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  // Also set a default base URL to ensure all requests go through the proxy
  axios.defaults.baseURL = window.location.origin;
} else {
  console.log('No token found in localStorage on app startup');
}

// Add axios request interceptor for logging
axios.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });
    
    // Ensure Authorization header is set for every request if token exists
    const token = localStorage.getItem('token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add axios response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Received 401 Unauthorized, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Create a router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  // Add a default loaders for each route
  defaultPendingComponent: () => (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold">Loading...</p>
    </div>
  ),
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
); 