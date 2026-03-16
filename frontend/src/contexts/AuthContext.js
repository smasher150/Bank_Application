import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      // For demo, we'll just set loading to false without validation
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    // Mock login for demo credentials
    if (credentials.email === 'admin@bank.com' && credentials.password === 'admin123') {
      const adminUser = {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@bank.com',
        role: 'ADMIN',
        employeeId: 'ADMIN001'
      };
      
      setUser(adminUser);
      setToken('demo-admin-token');
      localStorage.setItem('token', 'demo-admin-token');
      axios.defaults.headers.common['Authorization'] = `Bearer demo-admin-token`;
      
      return { success: true };
    }
    
    // Check for other demo users
    const demoUsers = [
      { email: 'john.smith@bank.com', password: 'password123', firstName: 'John', lastName: 'Smith', role: 'TELLER', employeeId: 'EMP001' },
      { email: 'sarah.johnson@bank.com', password: 'password123', firstName: 'Sarah', lastName: 'Johnson', role: 'MANAGER', employeeId: 'EMP002' },
      { email: 'michael.brown@bank.com', password: 'password123', firstName: 'Michael', lastName: 'Brown', role: 'AUDITOR', employeeId: 'EMP003' }
    ];
    
    const matchedUser = demoUsers.find(user => 
      user.email === credentials.email && user.password === credentials.password
    );
    
    if (matchedUser) {
      setUser(matchedUser);
      setToken('demo-user-token');
      localStorage.setItem('token', 'demo-user-token');
      axios.defaults.headers.common['Authorization'] = `Bearer demo-user-token`;
      
      return { success: true };
    }
    
    return { 
      success: false, 
      error: 'Invalid credentials' 
    };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
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
