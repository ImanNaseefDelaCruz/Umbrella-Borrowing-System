// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use your backend URL directly
  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      console.log('Attempting login with:', { identifier, password });
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, { // ✅ Full URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: identifier,
          password: password
        }),
      });

      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 200));
        throw new Error('Backend server not responding properly. Check if server is running on port 5000.');
      }

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Login failed: ${response.status}`);
      }

      // Store both user and token
      localStorage.setItem('user', JSON.stringify(data.data));
      localStorage.setItem('token', data.data.token);
      setUser(data.data);
      
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration with:', userData);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, { // ✅ Full URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Check if response is HTML
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 200));
        throw new Error('Backend server not responding properly. Check if server is running on port 5000.');
      }

      const data = await response.json();
      console.log('Register response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Registration failed: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;