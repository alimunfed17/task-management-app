import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize from localStorage if available
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,

    login: async (email: string, password: string) => {
      try {
        // Create FormData for OAuth2 compatibility
        const formData = new FormData();
        formData.append('username', email); // Backend accepts email as username
        formData.append('password', password);
        
        console.log('Logging in with:', { username: email });
        const response = await axios.post('/api/v1/auth/login', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const { access_token } = response.data;
        console.log('Login successful, received token:', access_token.substring(0, 10) + '...');
        
        // Set the token in localStorage and axios headers
        localStorage.setItem('token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Get user info with the token
        console.log('Getting user info with token');
        const userResponse = await axios.post('/api/v1/auth/test-token');
        console.log('User info received:', userResponse.data);
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        
        set({
          token: access_token,
          user: userResponse.data,
          isAuthenticated: true,
        });
        
        return true;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },

    signup: async (email: string, username: string, password: string) => {
      try {
        await axios.post('/api/v1/auth/signup', {
          email,
          username,
          password,
        });
        
        // Auto-login after signup
        return get().login(email, password);
      } catch (error) {
        // Store detailed error information for the UI
        if (axios.isAxiosError(error) && error.response) {
          console.error('Signup error details:', error.response.data);
          // Store error message in localStorage for the UI to display
          const errorMessage = error.response.data.detail || 'Registration failed. Please try again.';
          localStorage.setItem('signupError', errorMessage);
        }
        console.error('Signup error:', error);
        return false;
      }
    },

    logout: () => {
      console.log('Logging out, clearing token and user data');
      // Clear token from storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    },

    checkAuth: async () => {
      const token = get().token;
      
      console.log('checkAuth called, token exists:', !!token);
      
      if (!token) {
        console.log('No token found in state, checking localStorage');
        const localToken = localStorage.getItem('token');
        if (localToken) {
          console.log('Found token in localStorage, updating state');
          set({ token: localToken });
          axios.defaults.headers.common['Authorization'] = `Bearer ${localToken}`;
          // Continue with validation
        } else {
          console.log('No token in localStorage either, returning false');
          return false;
        }
      }
      
      try {
        // Set token in headers - use the possibly updated token
        const currentToken = get().token || localStorage.getItem('token');
        console.log('Setting auth header for test-token request with token:', currentToken?.substring(0, 10) + '...');
        axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
        
        // Try to get user info to validate token
        console.log('Sending test-token request');
        const response = await axios.post('/api/v1/auth/test-token');
        console.log('test-token response:', response.data);
        
        // Update user info
        localStorage.setItem('user', JSON.stringify(response.data));
        set({
          user: response.data,
          isAuthenticated: true,
          token: currentToken, // ensure token is in state
        });
        
        return true;
      } catch (error) {
        console.error('Token validation error:', error);
        // If token is invalid, logout
        get().logout();
        return false;
      }
    },
  };
}); 