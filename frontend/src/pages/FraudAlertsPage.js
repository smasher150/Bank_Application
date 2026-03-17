import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, Activity, Shield, TrendingUp } from 'lucide-react';

const FraudAlertsPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTransactions: 0,
    suspiciousTransactions: 0,
    highRiskEmployees: 0,
    systemAccessCount: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Load example data immediately for demonstration
    setLoading(true);
    const exampleAlerts = [
      {
        id: 1,
        type: 'Unusual Amount',
        severity: 'High',
        description: 'Transaction amount exceeds daily limit by 300%',
        employeeId: 'EMP003',
        employeeName: 'Michael Davis',
        transactionId: 'TXN001234569',
        amount: 50000.00,
        accountNumber: 'ACC100123458',
        timestamp: '2024-03-16T08:45:00Z',
        status: 'INVESTIGATION',
        riskScore: 9.2,
        department: 'Risk Management'
      },
      {
        id: 2,
        type: 'Off Hours Activity',
        severity: 'Medium',
        description: 'Employee accessed system outside normal working hours',
        employeeId: 'EMP005',
        employeeName: 'David Brown',
        transactionId: 'N/A',
        amount: 0,
        accountNumber: 'N/A',
        timestamp: '2024-03-16T02:30:00Z',
        status: 'REVIEW_PENDING',
        riskScore: 6.8,
        department: 'IT Security'
      },
      {
        id: 3,
        type: 'Manual Override',
        severity: 'High',
        description: 'Manual override of automated fraud detection',
        employeeId: 'EMP005',
        employeeName: 'David Brown',
        transactionId: 'TXN001234571',
        amount: 75000.00,
        accountNumber: 'ACC100123460',
        timestamp: '2024-03-16T07:30:00Z',
        status: 'MANUAL_REVIEW',
        riskScore: 8.9,
        department: 'IT Security'
      },
      {
        id: 4,
        type: 'System Access',
        severity: 'Critical',
        description: 'Unauthorized system access attempt detected',
        employeeId: 'EMP003',
        employeeName: 'Michael Davis',
        transactionId: 'N/A',
        amount: 0,
        accountNumber: 'N/A',
        timestamp: '2024-03-16T11:15:00Z',
        status: 'LOCKED',
        riskScore: 9.8,
        department: 'Risk Management'
      },
      {
        id: 5,
        type: 'Transaction Pattern',
        severity: 'Medium',
        description: 'Suspicious pattern of multiple small transactions',
        employeeId: 'EMP001',
        employeeName: 'John Smith',
        transactionId: 'TXN001234567',
        amount: 15000.00,
        accountNumber: 'ACC100123456',
        timestamp: '2024-03-16T10:30:00Z',
        status: 'MONITORING',
        riskScore: 5.5,
        department: 'Retail Banking'
      },
      {
        id: 6,
        type: 'Frequent Transactions',
        severity: 'Low',
        description: 'High frequency of transactions in short time period',
        employeeId: 'EMP002',
        employeeName: 'Sarah Johnson',
        transactionId: 'TXN001234570',
        amount: 1250.50,
        accountNumber: 'ACC100123459',
        timestamp: '2024-03-16T11:20:00Z',
        status: 'LOGGED',
        riskScore: 3.2,
        department: 'Commercial Banking'
      },
      {
        id: 7,
        type: 'Location Anomaly',
        severity: 'High',
        description: 'Transaction initiated from unusual geographic location',
        employeeId: 'EMP003',
        employeeName: 'Michael Davis',
        transactionId: 'TXN001234573',
        amount: 25000.00,
        accountNumber: 'ACC100123462',
        timestamp: '2024-03-16T06:15:00Z',
        status: 'INVESTIGATION',
        riskScore: 7.8,
        department: 'Risk Management'
      },
      {
        id: 8,
        type: 'Account Access',
        severity: 'Medium',
        description: 'Access to high-risk customer accounts',
        employeeId: 'EMP004',
        employeeName: 'Emily Wilson',
        transactionId: 'N/A',
        amount: 0,
        accountNumber: 'ACC100999999',
        timestamp: '2024-03-16T09:45:00Z',
        status: 'REVIEW',
        riskScore: 4.5,
        department: 'Audit'
      }
    ];
    
    setAlerts(exampleAlerts);
    setStats({
      totalTransactions: 156,
      suspiciousTransactions: 8,
      highRiskEmployees: 3,
      systemAccessCount: 489
    });
    setLoading(false);
  }, []);

  const departments = ['all', 'Retail Banking', 'Commercial Banking', 'Audit', 'Risk Management'];
  const riskLevels = ['all', 'Low', 'Medium', 'High', 'Critical'];

  const filteredAlerts = alerts
    .filter(alert => {
      const matchesSearch = `${alert.type} ${alert.severity} ${alert.employeeId}`
        .toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === 'all' || alert.department === filterDepartment;
      const matchesRisk = filterRisk === 'all' || 
        (filterRisk === 'Low' && alert.severity === 'Low') ||
        (filterRisk === 'Medium' && alert.severity === 'Medium') ||
        (filterRisk === 'High' && alert.severity === 'High') ||
        (filterRisk === 'Critical' && alert.severity === 'Critical');
      
      return matchesSearch && matchesDepartment && matchesRisk;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fraud Monitoring</h1>
          <p className="text-gray-600">Monitor suspicious activities and system access</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading fraud monitoring data...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{stats.totalTransactions}</h3>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{stats.suspiciousTransactions}</h3>
                  <p className="text-sm text-gray-600">Suspicious Transactions</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{stats.highRiskEmployees}</h3>
                  <p className="text-sm text-gray-600">High Risk Employees</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{stats.systemAccessCount}</h3>
                  <p className="text-sm text-gray-600">System Access Events</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          {!loading && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                >
                  {riskLevels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Risk Levels' : level}
                    </option>
                  ))}
                </select>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center justify-center">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detection Rules Status */}
      {!loading && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Active Detection Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Transaction Monitoring</h3>
                <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</div>
              </div>
              <p className="text-xs text-gray-600">Unusual amounts, frequency patterns, off-hours activity</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">System Access Monitoring</h3>
                <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</div>
              </div>
              <p className="text-xs text-gray-600">Unauthorized access attempts, audit log modifications</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">System Access Monitoring</h3>
              <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</div>
            </div>
            <p className="text-xs text-gray-600">Unauthorized access attempts, audit log modifications</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">Behavioral Analysis</h3>
              <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</div>
            </div>
            <p className="text-xs text-gray-600">Manual overrides, refusal to take leave, data manipulation patterns</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">Compliance Monitoring</h3>
              <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</div>
            </div>
            <p className="text-xs text-gray-600">Regulatory violations, reporting requirements</p>
          </div>
        </div>
      </div>
      )}

      {filteredAlerts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No suspicious activities found</div>
          <p className="text-gray-500 mt-2">All systems are operating normally</p>
        </div>
      )}
    </div>
  );
};

export default FraudAlertsPage;
