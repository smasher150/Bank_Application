import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  AlertTriangle, 
  FileText, 
  UserCircle 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/employees',
      label: 'Employees',
      icon: Users
    },
    {
      path: '/transactions',
      label: 'Transactions',
      icon: Receipt
    },
    {
      path: '/fraud-alerts',
      label: 'Fraud Alerts',
      icon: AlertTriangle
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: FileText
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: UserCircle
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-bank-primary">
          FraudMonitor
        </h2>
      </div>
      
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar-link ${
                  isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-xs text-gray-600">
            Contact the IT support team for assistance with the fraud monitoring system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
