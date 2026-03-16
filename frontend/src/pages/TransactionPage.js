import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, AlertTriangle } from 'lucide-react';

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterFlagged, setFilterFlagged] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load example data immediately for demonstration
    setLoading(true);
    setTransactions([
      {
        id: 1,
        transactionId: 'TXN001234567',
        accountNumber: 'ACC100123456',
        amount: 15000.00,
        transactionType: 'TRANSFER',
        description: 'Wire transfer to external account',
        transactionTime: '2024-03-16T10:30:00Z',
        riskLevel: 'HIGH',
        flagged: true,
        employeeId: 'EMP003',
        customerName: 'John Customer',
        status: 'REVIEW_PENDING'
      },
      {
        id: 2,
        transactionId: 'TXN001234568',
        accountNumber: 'ACC100123457',
        amount: 250.75,
        transactionType: 'WITHDRAWAL',
        description: 'Cash withdrawal at branch ATM',
        transactionTime: '2024-03-16T09:15:00Z',
        riskLevel: 'LOW',
        flagged: false,
        employeeId: 'EMP001',
        customerName: 'Jane Customer',
        status: 'COMPLETED'
      },
      {
        id: 3,
        transactionId: 'TXN001234569',
        accountNumber: 'ACC100123458',
        amount: 50000.00,
        transactionType: 'PAYMENT',
        description: 'Large bill payment service',
        transactionTime: '2024-03-16T08:45:00Z',
        riskLevel: 'CRITICAL',
        flagged: true,
        employeeId: 'EMP005',
        customerName: 'Corporate Client XYZ',
        status: 'INVESTIGATION'
      },
      {
        id: 4,
        transactionId: 'TXN001234570',
        accountNumber: 'ACC100123459',
        amount: 1250.50,
        transactionType: 'DEPOSIT',
        description: 'Check deposit - payroll',
        transactionTime: '2024-03-16T11:20:00Z',
        riskLevel: 'MEDIUM',
        flagged: false,
        employeeId: 'EMP002',
        customerName: 'Small Business Inc',
        status: 'COMPLETED'
      },
      {
        id: 5,
        transactionId: 'TXN001234571',
        accountNumber: 'ACC100123460',
        amount: 75000.00,
        transactionType: 'TRANSFER',
        description: 'International wire transfer',
        transactionTime: '2024-03-16T07:30:00Z',
        riskLevel: 'HIGH',
        flagged: true,
        employeeId: 'EMP005',
        customerName: 'Overseas Corporation',
        status: 'MANUAL_REVIEW'
      },
      {
        id: 6,
        transactionId: 'TXN001234572',
        accountNumber: 'ACC100123461',
        amount: 89.99,
        transactionType: 'PAYMENT',
        description: 'Online subscription renewal',
        transactionTime: '2024-03-16T12:00:00Z',
        riskLevel: 'LOW',
        flagged: false,
        employeeId: 'EMP001',
        customerName: 'Regular Customer',
        status: 'COMPLETED'
      },
      {
        id: 7,
        transactionId: 'TXN001234573',
        accountNumber: 'ACC100123462',
        amount: 25000.00,
        transactionType: 'WITHDRAWAL',
        description: 'Large cash withdrawal - business purpose',
        transactionTime: '2024-03-16T06:15:00Z',
        riskLevel: 'MEDIUM',
        flagged: true,
        employeeId: 'EMP003',
        customerName: 'Business Client LLC',
        status: 'DOCUMENTATION_REQUIRED'
      },
      {
        id: 8,
        transactionId: 'TXN001234574',
        accountNumber: 'ACC100123463',
        amount: 450.25,
        transactionType: 'DEPOSIT',
        description: 'Mobile check deposit',
        transactionTime: '2024-03-16T13:45:00Z',
        riskLevel: 'LOW',
        flagged: false,
        employeeId: 'EMP004',
        customerName: 'Individual Customer',
        status: 'COMPLETED'
      }
    ]);
    setLoading(false);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = `${transaction.transactionId} ${transaction.accountNumber} ${transaction.description}`
      .toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || transaction.riskLevel === filterRisk;
    const matchesFlagged = filterFlagged === 'all' || 
      (filterFlagged === 'flagged' && transaction.flagged) || 
      (filterFlagged === 'unflagged' && !transaction.flagged);
    const matchesType = filterType === 'all' || transaction.transactionType === filterType;
    
    return matchesSearch && matchesRisk && matchesFlagged && matchesType;
  });

  const riskLevels = ['all', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const transactionTypes = ['all', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT', 'REFUND'];

  const handleViewTransaction = (transaction) => {
    console.log('View transaction:', transaction);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Monitoring</h1>
          <p className="text-gray-600">Monitor and analyze suspicious transactions</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
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
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading transactions...</span>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
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
              </div>
              <div>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterFlagged}
                  onChange={(e) => setFilterFlagged(e.target.value)}
                >
                  <option value="all">All Transactions</option>
                  <option value="flagged">Flagged Only</option>
                  <option value="unflagged">Unflagged Only</option>
                </select>
              </div>
              <div>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  {transactionTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center justify-center">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      {!loading && !error && (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Transactions</h2>
        </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map(transaction => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.accountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.transactionType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.transactionTime).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                          transaction.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          transaction.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {transaction.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleViewTransaction(transaction)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {filteredTransactions.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No transactions found</div>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
