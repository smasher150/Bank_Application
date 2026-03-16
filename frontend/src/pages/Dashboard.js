import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, Receipt, UserCheck, Activity } from 'lucide-react';
import FraudChart from '../components/FraudChart';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    transactionsToday: 0,
    fraudAlerts: 0,
    highRiskEmployees: 0,
    riskScore: 0
  });
  
  const [chartData, setChartData] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [highRiskEmployeesList, setHighRiskEmployeesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

      setStats({
        totalEmployees: employees.length,
        transactionsToday: transactions.length,
        fraudAlerts: alerts.length,
        highRiskEmployees: employees.filter(e => e.riskScore > 4).length,
        riskScore: employees.length > 0 ? employees.reduce((sum, e) => sum + e.riskScore, 0) / employees.length : 0
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
        alerts: alertsByDay[day]
      }));

      setChartData(chartDataArray);

      // Set recent alerts with real data
      setRecentAlerts(alerts.slice(0, 5));

      // Set high risk employees with real data
      setHighRiskEmployeesList(
        employees
          .filter(e => e.riskScore > 4)
          .slice(0, 5)
          .map(e => ({
            id: e.id,
            employeeId: e.employeeId,
            alerts: e.alerts || 0,
            transactions: e.transactionCount || 0,
            riskScore: e.riskScore || 0
          }))
      );

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px' }}>
      {/* Error State */}
      {error && (
        <div style={{ marginBottom: '32px', padding: '16px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertTriangle style={{ height: '20px', width: '20px', color: '#dc2626', marginRight: '8px' }} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #3b82f6', 
            borderTop: '4px solid #3b82f6', 
            borderRight: '4px solid #3b82f6', 
            borderBottom: '4px solid #3b82f6', 
            borderLeft: '4px solid #3b82f6'
          }}></div>
          <span style={{ marginLeft: '16px', color: '#3b82f6' }}>Loading dashboard...</span>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <div>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Manager Dashboard</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Real-time fraud monitoring and analytics</p>
          </div>

          {/* Statistics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {/* Total Employees Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  backgroundColor: '#dbeafe', 
                  borderRadius: '8px', 
                  padding: '12px' 
                }}>
                  <Users style={{ height: '24px', width: '24px', color: '#2563eb' }} />
                </div>
                <div style={{ marginLeft: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Total Employees</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>{stats.totalEmployees}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Active employees</div>
                </div>
              </div>
            </div>

            {/* Transactions Today Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  backgroundColor: '#10b981', 
                  borderRadius: '8px', 
                  padding: '12px' 
                }}>
                  <Activity style={{ height: '24px', width: '24px', color: '#059669' }} />
                </div>
                <div style={{ marginLeft: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Transactions Today</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>{stats.transactionsToday}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Last 24 hours</div>
                </div>
              </div>
            </div>

            {/* Fraud Alerts Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  backgroundColor: '#fee2e2', 
                  borderRadius: '8px', 
                  padding: '12px' 
                }}>
                  <AlertTriangle style={{ height: '24px', width: '24px', color: '#dc2626' }} />
                </div>
                <div style={{ marginLeft: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Fraud Alerts</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>{stats.fraudAlerts}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Active alerts</div>
                </div>
              </div>
            </div>

            {/* High Risk Employees Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  backgroundColor: '#f97316', 
                  borderRadius: '8px', 
                  padding: '12px' 
                }}>
                  <UserCheck style={{ height: '24px', width: '24px', color: '#f97316' }} />
                </div>
                <div style={{ marginLeft: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>High Risk Employees</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>{stats.highRiskEmployees}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Risk score &gt; 4.0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Fraud Chart - Takes 2 columns */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>Fraud Analytics</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ 
                    padding: '6px 12px', 
                    fontSize: '14px', 
                    backgroundColor: '#dbeafe', 
                    color: '#2563eb', 
                    borderRadius: '8px', 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}>Week</button>
                  <button style={{ 
                    padding: '6px 12px', 
                    fontSize: '14px', 
                    backgroundColor: '#f9fafb', 
                    color: '#6b7280', 
                    borderRadius: '8px', 
                    border: '1px solid #d1d5db', 
                    cursor: 'pointer' 
                  }}>Month</button>
                </div>
              </div>
              <FraudChart data={chartData} />
            </div>

            {/* High Risk Employees - Takes 1 column */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>High Risk Employees</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {highRiskEmployeesList.map((employee, index) => (
                  <div key={employee.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    backgroundColor: '#f9fafb', 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb' 
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{employee.employeeId}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{employee.alerts} alerts • {employee.transactions} transactions</div>
                    </div>
                    <div style={{ 
                      padding: '4px 8px', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      borderRadius: '9999px', 
                      backgroundColor: employee.riskScore >= 8 ? '#fef2f2' : employee.riskScore >= 6 ? '#fed7aa' : '#fbbf24', 
                      color: employee.riskScore >= 8 ? '#dc2626' : employee.riskScore >= 6 ? '#d97706' : '#f59e0b' 
                    }}>
                      {employee.riskScore.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Alerts Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>Recent System Activity</h2>
                <button style={{ color: '#2563eb', fontSize: '14px', fontWeight: '500', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}>View All Activity →</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Type</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Severity</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Employee ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAlerts.map((alert, index) => (
                      <tr key={index} style={{ borderBottom: index === recentAlerts.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            padding: '4px 8px', 
                            borderRadius: '9999px', 
                            backgroundColor: alert.severity === 'High' ? '#fef2f2' : alert.severity === 'Medium' ? '#fed7aa' : '#fbbf24', 
                            color: alert.severity === 'High' ? '#dc2626' : alert.severity === 'Medium' ? '#d97706' : '#f59e0b' 
                          }}>{alert.type}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            fontSize: '12px', 
                            fontWeight: '500', 
                            padding: '4px 8px', 
                            borderRadius: '9999px', 
                            backgroundColor: alert.severity === 'High' ? '#fef2f2' : alert.severity === 'Medium' ? '#fed7aa' : '#fbbf24', 
                            color: alert.severity === 'High' ? '#dc2626' : alert.severity === 'Medium' ? '#d97706' : '#f59e0b' 
                          }}>{alert.severity}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>{alert.employeeId}</span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '12px', color: '#6b7280' }}>{alert.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Dashboard;
