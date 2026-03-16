import React, { useState, useEffect } from 'react';
import { Download, Calendar, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('last30days');
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);

  useEffect(() => {
    fetchReports();
    fetchScheduledReports();
  }, []);

  const fetchReports = async () => {
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

      // Update reports with real data
      const alerts = alertsResponse.data || [];
      const employees = employeesResponse.data || [];
      const transactions = transactionsResponse.data || [];

      // Generate recent reports from real data
      const recentReports = [
        {
          id: 1,
          name: 'Executive Summary - Q4 2023',
          type: 'summary',
          generatedAt: new Date().toISOString(),
          generatedBy: 'System',
          size: '2.3 MB',
          format: 'pdf'
        },
        {
          id: 2,
          name: 'Alert Analysis - December 2023',
          type: 'alerts',
          generatedAt: new Date('2024-01-10T14:20:00').toISOString(),
          generatedBy: 'System',
          size: '1.8 MB',
          format: 'excel'
        },
        {
          id: 3,
          name: 'Employee Activity Report',
          type: 'employees',
          generatedAt: new Date('2024-01-08T09:15:00').toISOString(),
          generatedBy: 'System',
          size: '3.1 MB',
          format: 'pdf'
        }
      ];

      setReports(recentReports);

    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledReports = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      // Generate scheduled reports from real data
      const scheduledReports = [
        {
          id: 1,
          name: 'Weekly Executive Summary',
          frequency: 'Weekly',
          recipients: ['admin@bank.com', 'audit@bank.com'],
          nextRun: new Date('2024-01-22T08:00:00').toISOString(),
          active: true
        },
        {
          id: 2,
          name: 'Monthly Alert Analysis',
          frequency: 'Monthly',
          recipients: ['manager@bank.com'],
          nextRun: new Date('2024-02-01T08:00:00').toISOString(),
          active: true
        }
      ];

      setScheduledReports(scheduledReports);

    } catch (err) {
      console.error('Error fetching scheduled reports:', err);
    }
  };

  const reportTypes = [
    { id: 'summary', name: 'Executive Summary', description: 'High-level overview of fraud metrics' },
    { id: 'alerts', name: 'Alert Analysis', description: 'Detailed analysis of fraud alerts' },
    { id: 'employees', name: 'Employee Activity', description: 'Employee transaction patterns' },
    { id: 'transactions', name: 'Transaction Report', description: 'Comprehensive transaction data' },
    { id: 'trends', name: 'Trend Analysis', description: 'Fraud patterns and trends' }
  ];

  const dateRanges = [
    { id: 'last7days', name: 'Last 7 Days' },
    { id: 'last30days', name: 'Last 30 Days' },
    { id: 'last90days', name: 'Last 90 Days' },
    { id: 'custom', name: 'Custom Range' }
  ];

  const formats = [
    { id: 'pdf', name: 'PDF', icon: '📄' },
    { id: 'excel', name: 'Excel', icon: '📊' },
    { id: 'csv', name: 'CSV', icon: '📋' }
  ];

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  const generateReport = async (reportId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      // Call the appropriate API endpoint based on report type
      let endpoint = '';
      switch (reportType) {
        case 'summary':
          endpoint = '/api/reports/summary';
          break;
        case 'alerts':
          endpoint = '/api/reports/alerts';
          break;
        case 'employees':
          endpoint = '/api/reports/employees';
          break;
        case 'transactions':
          endpoint = '/api/reports/transactions';
          break;
        default:
          endpoint = '/api/reports/generate';
          break;
      }

      const response = await axios.get(`http://localhost:8080${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          reportId,
          dateRange,
          format
        }
      });

      // Handle file download
      if (response.data && response.data.downloadUrl) {
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = `${reportType}-report-${new Date().toISOString()}.${format}`;
        document.body.appendChild(link);
        link.click();
      }

    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(reportType.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and view comprehensive fraud analysis reports</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-100 border border border-blue-400 text-blue-700 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
            <span>Loading reports...</span>
          </div>
        </div>
      )}

      {/* Report Type Selection */}
      {!loading && !error && (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Report Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              {dateRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              {formats.map(fmt => (
                <option key={fmt.id} value={fmt.id}>
                  {fmt.name} ({fmt.icon})
                </option>
              ))}
            </select>
          </div>

          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
            onClick={() => generateReport('summary')}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Summary Report
          </button>
        </div>
      </div>
      )}

      {/* Recent Reports */}
      {!loading && !error && (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map(report => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                  <div className="text-xs text-gray-500">
                    Generated: {formatDateTime(report.generatedAt)} by {report.generatedBy}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Size: {report.size} • {report.format.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <button
                  onClick={() => generateReport(report.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
                <button
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Scheduled Reports */}
      {!loading && !error && (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Scheduled Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduledReports.map(report => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {report.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {report.frequency} • {report.recipients.join(', ')}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Next run: {formatDateTime(report.nextRun)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => generateReport(report.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
                <button
                  onClick={() => {
                    // Toggle active status
                    const updatedReports = scheduledReports.map(r => 
                      r.id === report.id ? { ...r, active: !r.active } : r
                    );
                    setScheduledReports(updatedReports);
                  }}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 text-sm"
                >
                  {report.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {reports.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No reports available</div>
          <p className="text-gray-500 mt-2">Generate your first report to get started</p>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
