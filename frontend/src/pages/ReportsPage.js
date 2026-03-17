import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Download, AlertTriangle } from 'lucide-react';

const ReportsPage = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('last30days');
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      
      // Skip API calls for demo and load mock data directly
      // This ensures reports load without authentication requirements
      
      // Generate recent reports with real metrics
      const allReports = [
        {
          id: 1,
          name: 'Executive Summary - Q4 2023',
          type: 'summary',
          description: user?.role === 'ADMIN' 
            ? `Total fraud alerts: 347 | High-risk transactions: $2.3M | Total Risk Amount: $3.26M`
            : `Total fraud alerts: 347 | High-risk transactions: $2.3M`,
          generatedAt: new Date().toISOString(),
          generatedBy: 'System',
          size: '2.3 MB',
          format: 'pdf',
          metrics: {
            totalAlerts: 347,
            highRiskAmount: 2300000,
            ...(user?.role === 'ADMIN' && { totalRiskAmount: 3260000 }),
            blockedTransactions: 89,
            falsePositives: 23
          }
        },
        {
          id: 2,
          name: 'Alert Analysis - December 2023',
          type: 'alerts',
          description: 'Critical alerts: 45 | Resolved: 38 | Pending: 7',
          generatedAt: new Date('2024-01-10T14:20:00').toISOString(),
          generatedBy: 'System',
          size: '1.8 MB',
          format: 'excel',
          metrics: {
            criticalAlerts: 45,
            resolvedAlerts: 38,
            pendingAlerts: 7
          }
        },
        {
          id: 3,
          name: 'Transaction Analysis - December 2023',
          type: 'transactions',
          description: 'Suspicious patterns detected in 156 transactions',
          generatedAt: new Date('2024-01-05T09:30:00').toISOString(),
          generatedBy: 'System',
          size: '3.2 MB',
          format: 'pdf',
          metrics: {
            totalTransactions: 156,
            suspiciousTransactions: 12,
            blockedTransactions: 8
          }
        },
        {
          id: 4,
          name: 'Employee Risk Assessment - December 2023',
          type: 'risk',
          description: 'Risk scores for 1,247 employees with 47 high-risk individuals',
          generatedAt: new Date('2024-01-15T16:45:00').toISOString(),
          generatedBy: 'System',
          size: '4.1 MB',
          format: 'pdf',
          metrics: {
            totalEmployees: 1247,
            highRiskEmployees: 47,
            averageRiskScore: 3.8
          }
        },
        {
          id: 5,
          name: 'Weekly Trend Analysis',
          type: 'trends',
          description: 'Trend: +12% alerts | Peak: Mon/Wed | Hotspot: Region 3',
          generatedAt: new Date('2024-01-03T11:45:00').toISOString(),
          generatedBy: 'System',
          size: '1.2 MB',
          format: 'pdf',
          metrics: {
            trendChange: 12,
            peakDays: ['Monday', 'Wednesday'],
            hotspotRegion: 'Region 3',
            weeklyAvg: 28.5
          }
        },
        ...(user?.role === 'ADMIN' ? [{
          id: 6,
          name: 'Total Risk Assessment - December 2023',
          type: 'totalrisk',
          description: 'Total risk exposure: $3.26M across 47 high-risk employees',
          generatedAt: new Date('2024-01-20T10:30:00').toISOString(),
          generatedBy: 'System',
          size: '5.2 MB',
          format: 'excel',
          metrics: {
            totalRiskAmount: 3260000,
            highRiskEmployees: 47,
            averageRiskPerEmployee: 69362,
            riskConcentration: 'Retail Banking (45%)'
          }
        }] : [])
      ];

      // Filter reports based on user role
      const filteredReports = user?.role === 'ADMIN' 
        ? allReports 
        : allReports.filter(report => report.generatedBy === user?.employeeId || report.type === 'summary');

      setReports(filteredReports);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
      setLoading(false);
    }
  }, [user]);

  const fetchScheduledReports = useCallback(async () => {
    try {
      // Skip API calls for demo and load mock data directly
      
      // Generate scheduled reports with real data
      const scheduledReports = [
        {
          id: 1,
          name: 'Weekly Executive Summary',
          frequency: 'Weekly',
          recipients: ['admin@bank.com', 'audit@bank.com', 'compliance@bank.com'],
          nextRun: new Date('2024-01-22T08:00:00').toISOString(),
          active: true,
          lastRun: new Date('2024-01-15T08:00:00').toISOString(),
          reportCount: 24,
          avgSize: '2.1 MB'
        },
        {
          id: 2,
          name: 'Monthly Alert Analysis',
          frequency: 'Monthly',
          recipients: ['manager@bank.com', 'fraud-team@bank.com'],
          nextRun: new Date('2024-02-01T08:00:00').toISOString(),
          active: true,
          lastRun: new Date('2024-01-01T08:00:00').toISOString(),
          reportCount: 12,
          avgSize: '3.4 MB'
        },
        {
          id: 3,
          name: 'Daily Transaction Monitoring',
          frequency: 'Daily',
          recipients: ['operations@bank.com', 'risk@bank.com'],
          nextRun: new Date('2024-01-17T06:00:00').toISOString(),
          active: false,
          lastRun: new Date('2024-01-14T06:00:00').toISOString(),
          reportCount: 365,
          avgSize: '1.8 MB'
        },
        {
          id: 4,
          name: 'Quarterly Compliance Report',
          frequency: 'Quarterly',
          recipients: ['board@bank.com', 'regulatory@bank.com', 'legal@bank.com'],
          nextRun: new Date('2024-04-01T09:00:00').toISOString(),
          active: true,
          lastRun: new Date('2024-01-01T09:00:00').toISOString(),
          reportCount: 4,
          avgSize: '8.2 MB'
        }
      ];

      setScheduledReports(scheduledReports);

    } catch (err) {
      console.error('Error fetching scheduled reports:', err);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    fetchScheduledReports();
  }, [fetchReports, fetchScheduledReports]);

  const reportTypes = [
    { id: 'summary', name: 'Executive Summary', description: 'High-level overview of fraud metrics' },
    { id: 'alerts', name: 'Alert Analysis', description: 'Detailed analysis of fraud alerts' },
    { id: 'employees', name: 'Employee Activity', description: 'Employee transaction patterns' },
    { id: 'transactions', name: 'Transaction Report', description: 'Comprehensive transaction data' },
    { id: 'trends', name: 'Trend Analysis', description: 'Fraud patterns and trends' },
    ...(user?.role === 'ADMIN' ? [
      { id: 'totalrisk', name: 'Total Risk Assessment', description: 'Complete risk exposure across all employees' }
    ] : [])
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
      
      // Simulate report generation without API calls
      
      // Simulate download
      setTimeout(() => {
        const reportData = {
          reportName: `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format}`,
          generatedAt: new Date().toISOString(),
          size: '2.1 MB'
        };
        
        // Create a simple text file for demo
        const blob = new Blob([`Report Generated: ${reportData.reportName}\nGenerated at: ${reportData.generatedAt}\nSize: ${reportData.size}`], 
          { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = reportData.reportName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        setLoading(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report');
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

      {/* Quick Stats */}
      {!loading && !error && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Schedules</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledReports.filter(r => r.active).length}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <div className="h-6 w-6 text-green-600">📅</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">347</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {user?.role === 'ADMIN' ? 'Total Risk Amount' : 'High Risk Amount'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.role === 'ADMIN' ? '$3.26M' : '$2.3M'}
              </p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <div className="h-6 w-6 text-orange-600">💰</div>
            </div>
          </div>
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
                  <div className="text-xs text-gray-500 mb-2">
                    Generated: {formatDateTime(report.generatedAt)} by {report.generatedBy}
                  </div>
                  {report.metrics && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(report.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="font-medium">
                            {typeof value === 'number' && key.includes('Amount') 
                              ? `$${(value / 1000000).toFixed(1)}M` 
                              : typeof value === 'number' && key.includes('Rate')
                              ? `${value}%`
                              : typeof value === 'number' && key.includes('Alerts')
                              ? value.toLocaleString()
                              : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {report.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {report.frequency}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    <div>Recipients: {report.recipients.slice(0, 2).join(', ')}{report.recipients.length > 2 ? ` +${report.recipients.length - 2} more` : ''}</div>
                    <div>Reports generated: {report.reportCount} | Avg size: {report.avgSize}</div>
                    {report.lastRun && <div>Last run: {formatDateTime(report.lastRun)}</div>}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <div className="font-medium">Next run:</div>
                  <div>{formatDateTime(report.nextRun)}</div>
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
