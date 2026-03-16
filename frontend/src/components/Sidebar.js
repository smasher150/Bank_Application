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
    </div>
  );
};

export default Sidebar;
