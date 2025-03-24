import { createRootRoute, createRoute, createRouter, Link } from '@tanstack/react-router';
import { z } from 'zod';
import React from 'react';

import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import TaskEditPage from '../pages/TaskEditPage';
import RootLayout from '../components/layouts/RootLayout';
import ProtectedLayout from '../components/layouts/ProtectedLayout';

// Simple error boundary component
const ErrorComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-red-600 text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-700 mb-4">
          An error occurred while trying to load this page.
        </p>
        <div className="flex justify-between">
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

// Root route with auth checking
export const rootRoute = createRootRoute({
  component: RootLayout,
  errorComponent: ErrorComponent,
});

// Public routes
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
});

// Protected layout route
export const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedLayout,
});

// Dashboard
export const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/dashboard',
  component: DashboardPage,
});

// Task edit
export const taskEditRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/tasks/$taskId/edit',
  component: TaskEditPage,
  validateParams: {
    taskId: z.string(),
  },
});

// Index route - redirect to dashboard or login
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const token = localStorage.getItem('token');
    
    // Use Link component for navigation
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-xl font-bold mb-4">Welcome to Task Management</h1>
        {token ? (
          <Link 
            to="/dashboard" 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex flex-col gap-2">
            <Link 
              to="/login" 
              className="px-4 py-2 bg-blue-500 text-white rounded text-center"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded text-center"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    );
  },
});

// Create and export the route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  protectedRoute.addChildren([
    dashboardRoute,
    taskEditRoute,
  ]),
]); 