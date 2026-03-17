import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Shield, AlertCircle, WifiOff, Server } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(credentials);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const getErrorIcon = () => {
    if (error.includes('Network error')) {
      return <WifiOff className="h-5 w-5 text-orange-600" />;
    }
    if (error.includes('Server error') || error.includes('server returned') || error.includes('Unexpected error')) {
      return <Server className="h-5 w-5 text-yellow-600" />;
    }
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  const getErrorSeverity = () => {
    if (error.includes('Network error')) {
      return 'bg-orange-50 border-orange-200 text-orange-800';
    }
    if (error.includes('Server error') || error.includes('server returned') || error.includes('Unexpected error')) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
    return 'bg-red-50 border-red-200 text-red-800';
  };

  const getErrorTitle = () => {
    if (error.includes('Network error')) {
      return 'Connection Error';
    }
    if (error.includes('Server error') || error.includes('server returned') || error.includes('Unexpected error')) {
      return 'Server Issue';
    }
    if (error.includes('Account is disabled')) {
      return 'Account Disabled';
    }
    if (error.includes('Account is locked')) {
      return 'Account Locked';
    }
    return 'Authentication Failed';
  };

  const getErrorHelp = () => {
    if (error.includes('Invalid email or password')) {
      return 'Please check your credentials and try again.';
    }
    if (error.includes('Account is disabled')) {
      return 'Please contact your administrator to reactivate your account.';
    }
    if (error.includes('Account is locked')) {
      return 'Please contact your administrator to unlock your account.';
    }
    if (error.includes('Network error')) {
      return 'Please ensure the backend server is running on localhost:8080';
    }
    if (error.includes('user data is missing')) {
      return 'Your credentials are correct, but the server has a data retrieval issue. Please check server status.';
    }
    if (error.includes('Server error') || error.includes('server returned') || error.includes('Unexpected error')) {
      return 'Your credentials may be correct, but the server is experiencing issues. Please check server status.';
    }
    return 'Please try again or contact support if the problem persists.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bank-primary to-bank-accent flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-white">
            <Shield className="h-8 w-8 text-bank-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to FraudMonitor
          </h2>
          <p className="mt-2 text-center text-sm text-blue-100">
            Bank Employee Fraud Monitoring System
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-transparent placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bank-secondary focus:bg-white bg-gray-50"
                placeholder="Email address"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-transparent placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bank-secondary focus:bg-white bg-gray-50"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className={`rounded-md border p-4 flex items-start space-x-3 animate-pulse ${getErrorSeverity()}`}>
              <div className="flex-shrink-0">
                {getErrorIcon()}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">
                  {getErrorTitle()}
                </h3>
                <div className="mt-1 text-sm">
                  {error}
                </div>
                <div className="mt-2 text-xs">
                  {getErrorHelp()}
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-bank-secondary hover:bg-bank-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bank-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-blue-100">
              Backend Credentials: admin@bank.com / admin123
            </p>
            <p className="text-xs text-blue-200 mt-1">
              Or: john.smith@bank.com / password123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
