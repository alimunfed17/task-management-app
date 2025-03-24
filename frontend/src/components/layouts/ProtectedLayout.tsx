import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../../store/authStore';
import Navbar from '../Navbar';
import axios from 'axios';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, checkAuth, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      setIsChecking(true);
      
      // Make sure axios has the token
      if (token) {
        console.log('Setting auth token in protected layout', token.substring(0, 10) + '...');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        console.log('No token available in protected layout');
      }
      
      // Check if the user is authenticated
      try {
        const isAuth = await checkAuth();
        console.log('Auth check result:', isAuth);
        
        if (!isAuth) {
          console.log('Not authenticated, redirecting to login');
          navigate({ to: '/login' });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate({ to: '/login' });
      } finally {
        setIsChecking(false);
      }
    };

    // Run auth check immediately
    authCheck();
    
    // Set up interval to refresh authentication every 5 minutes
    const intervalId = setInterval(() => {
      if (!isChecking) {
        checkAuth().catch(() => navigate({ to: '/login' }));
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(intervalId);
  }, [checkAuth, navigate, token, isChecking]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Checking authentication...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    navigate({ to: '/login' });
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout; 