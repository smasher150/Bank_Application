import React, { useState, useEffect } from 'react';
import { Search, Filter, Activity, Shield, TrendingUp } from 'lucide-react';
import axios from 'axios';

const FraudAlertsPage = () => {
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
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchFraudData();
  }, []);

  const fetchFraudData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      // Fetch all data in parallel
      const [alertsResponse, employeesResponse, transactionsResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/fraud-alerts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        axios.get('http://localhost:8080/api/employees', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        axios.get('http://localhost:8080/api/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      // Update stats with real data
      const alerts = alertsResponse.data || [];
      const employees = employeesResponse.data || [];
      const transactions = transactionsResponse.data || [];

      setAlerts(alerts);
      setStats({
        totalTransactions: transactions.length,
        suspiciousTransactions: alerts.filter(a => a.type === 'Unusual Amount' || a.type === 'Frequent Transactions').length,
        highRiskEmployees: employees.filter(e => e.riskScore > 4).length,
        systemAccessCount: employees.reduce((sum, e) => sum + (e.transactionCount || 0), 0)
      });

    } catch (err) {
      console.error('Error fetching fraud data:', err);
      setError('Failed to load fraud monitoring data');
    } finally {
      setLoading(false);
    }
  };

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

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-100 border border border-blue-400 text-blue-700 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
            <span>Loading fraud monitoring data...</span>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {!loading && !error && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Transactions</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</div>
              <div className="text-xs text-gray-500">Last 30 days</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Suspicious Transactions</div>
              <div className="text-2xl font-bold text-gray-900">{stats.suspiciousTransactions}</div>
              <div className="text-xs text-gray-500">Flagged transactions</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">High Risk Employees</div>
              <div className="text-2xl font-bold text-gray-900">{stats.highRiskEmployees}</div>
              <div className="text-xs text-gray-500">Risk score &gt; 4.0</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">System Access Events</div>
              <div className="text-2xl font-bold text-gray-900">{stats.systemAccessCount}</div>
              <div className="text-xs text-gray-500">Access attempts</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Filters */}
      {!loading && !error && (
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

      {/* Detection Rules Status */}
      {!loading && !error && (
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

      {filteredAlerts.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No suspicious activities found</div>
          <p className="text-gray-500 mt-2">All systems are operating normally</p>
        </div>
      )}
    </div>
  );
};

export default FraudAlertsPage;
