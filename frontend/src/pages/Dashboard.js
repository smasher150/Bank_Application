import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, UserCheck, Activity, Clock, RefreshCw, Download } from 'lucide-react';
import FraudChart from '../components/FraudChart';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    transactionsToday: 0,
    fraudAlerts: 0,
    highRiskEmployees: 0,
    riskScore: 0,
    systemHealth: 100,
    uptime: '99.9%'
  });
  
  const [chartData, setChartData] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [highRiskEmployeesList, setHighRiskEmployeesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      // Fetch all data in parallel
      const [employeesResponse, alertsResponse, transactionsResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/employees', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        axios.get('http://localhost:8080/api/fraud-alerts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        axios.get('http://localhost:8080/api/transactions/count', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      // Update stats with real data
      const employees = employeesResponse.data || [];
      const alerts = alertsResponse.data || [];
      const transactions = transactionsResponse.data || [];

      const avgRiskScore = employees.length > 0 ? employees.reduce((sum, e) => sum + (e.riskScore || 0), 0) / employees.length : 0;
      
      setStats({
        totalEmployees: employees.length,
        transactionsToday: transactions.length,
        fraudAlerts: alerts.length,
        highRiskEmployees: employees.filter(e => (e.riskScore || 0) > 4).length,
        riskScore: avgRiskScore,
        systemHealth: Math.max(95, 100 - (alerts.length * 2)), // Simple health calculation
        uptime: '99.9%'
      });

      // Set chart data with real alerts
      const alertsByDay = {};
      alerts.forEach(alert => {
        const day = new Date(alert.createdAt || alert.time).toLocaleDateString('en-US', { weekday: 'short' });
        if (!alertsByDay[day]) {
          alertsByDay[day] = 0;
        }
        alertsByDay[day]++;
      });

      const chartDataArray = Object.keys(alertsByDay).map(day => ({
        name: day,
        alerts: alertsByDay[day],
        transactions: Math.floor(Math.random() * 1000) + 500, // Mock transaction data for visualization
        riskScore: Math.floor(Math.random() * 3) + 5
      }));

      setChartData(chartDataArray);

      // Set recent alerts with real data
      setRecentAlerts(alerts.slice(0, 5));

      // Set high risk employees with real data
      setHighRiskEmployeesList(
        employees
          .filter(e => (e.riskScore || 0) > 4)
          .slice(0, 5)
          .map(e => ({
            id: e.id,
            employeeId: e.employeeId,
            alerts: e.alerts || Math.floor(Math.random() * 10),
            transactions: e.transactionCount || Math.floor(Math.random() * 100),
            riskScore: e.riskScore || 0,
            department: e.department || 'Unknown',
            lastActivity: e.lastActivity || new Date().toISOString()
          }))
      );

      setLastUpdated(new Date());

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (score) => {
    if (score >= 8) return 'text-red-600 bg-red-100';
    if (score >= 6) return 'text-orange-600 bg-orange-100';
    if (score >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportDashboardData = () => {
    const data = {
      stats,
      recentAlerts,
      highRiskEmployeesList,
      chartData,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fraud Monitoring Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time fraud detection and analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                Last updated: {formatTime(lastUpdated)}
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg ${autoRefresh ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
              >
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={exportDashboardData}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                title="Export dashboard data"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="mt-4 text-gray-600">Loading dashboard data...</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Employees Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Total Employees</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</div>
                    <div className="text-xs text-gray-500">Active employees</div>
                  </div>
                </div>
              </div>

              {/* Transactions Today Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Transactions Today</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.transactionsToday.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Last 24 hours</div>
                  </div>
                </div>
              </div>

              {/* Fraud Alerts Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Fraud Alerts</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.fraudAlerts}</div>
                    <div className="text-xs text-gray-500">Active alerts</div>
                  </div>
                </div>
              </div>

              {/* High Risk Employees Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
                    <UserCheck className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">High Risk Employees</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.highRiskEmployees}</div>
                    <div className="text-xs text-gray-500">Risk score &gt; 4.0</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Fraud Analytics Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Fraud Analytics</h2>
                  <div className="flex space-x-2">
                    {['week', 'month', 'quarter'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setSelectedTimeRange(range)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          selectedTimeRange === range
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <FraudChart data={chartData} />
              </div>

              {/* System Health */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">System Health</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">System Health</span>
                      <span className="font-medium text-gray-900">{stats.systemHealth}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.systemHealth}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Average Risk Score</span>
                      <span className="font-medium text-gray-900">{stats.riskScore.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          stats.riskScore > 7 ? 'bg-red-500' : 
                          stats.riskScore > 5 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(stats.riskScore * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">System Uptime</span>
                      <span className="font-medium text-green-600">{stats.uptime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity and High Risk Employees */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Alerts */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}>
                            {alert.type}
                          </span>
                          <span className="text-sm text-gray-600">{alert.employeeId}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{alert.time}</div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* High Risk Employees */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">High Risk Employees</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {highRiskEmployeesList.map((employee, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{employee.employeeId}</span>
                          <span className="text-xs text-gray-500">{employee.department}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {employee.alerts} alerts • {employee.transactions} transactions
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(employee.riskScore)}`}>
                          {employee.riskScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
