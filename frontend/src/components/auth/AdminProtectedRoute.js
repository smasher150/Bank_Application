import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bank-secondary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-2.502 0-.831-.467-1.543-1.467-1.543H4.75c-.831 0-1.543.467-1.543 1.467C2.928 16.034 2.426 17 4.75 17h2.5c1.324 0 2.502-.834 2.502-2.502 0-.665-.262-1.235-.798-1.848l.814-2.848c.57-.422 1.135-.846 1.889-1.26.542-.422-.913-.846-1.889-1.26zm0 0l-1.814 1.814c-.57.422-1.135.846-1.889 1.26-.542.422-.913.846-1.889 1.26zm0 0l1.814-1.814c.57-.422 1.135-.846 1.889-1.26.542-.422.913-.846 1.889-1.26z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-red-500 mb-4">
              Only administrators can access the Employee Management page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
