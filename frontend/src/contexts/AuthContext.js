import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a token in localStorage
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // For demo, we'll just set loading to false without validation
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, employee } = data;
        
        // Check if employee data is missing (backend issue)
        if (!employee) {
          return { 
            success: false, 
            error: 'Authentication succeeded but user data is missing. Please check server status.' 
          };
        }
        
        setUser(employee);
        setToken(token);
        localStorage.setItem('token', token);
        
        return { success: true };
      } else {
        let errorMessage = 'Login failed';
        
        if (data.error) {
          if (data.error.includes('Invalid credentials')) {
            errorMessage = 'Invalid email or password';
          } else if (data.error.includes('disabled')) {
            errorMessage = 'Account is disabled';
          } else if (data.error.includes('locked')) {
            errorMessage = 'Account is locked';
          } else {
            errorMessage = data.error;
          }
        } else if (response.status === 500) {
          errorMessage = 'Server error. Credentials may be correct, but server has issues. Please check server status.';
        } else if (response.status === 401) {
          errorMessage = 'Authentication failed. Please verify your credentials.';
        } else {
          errorMessage = `Server returned ${response.status}. Credentials may be correct, but please check server status.`;
        }
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if it's a network error vs other errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          success: false, 
          error: 'Network error. Please check if the backend server is running on localhost:8080' 
        };
      }
      
      return { 
        success: false, 
        error: 'Unexpected error occurred. Credentials may be correct, but please check server status.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
