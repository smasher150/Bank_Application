import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowUpDown, AlertTriangle, CheckCircle, User, Search, DollarSign, Building, CreditCard, ArrowRight, Eye, EyeOff } from 'lucide-react';

const TransferPage = () => {
  const { user } = useAuth();
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    transferType: 'withinBank', // 'withinBank', 'toOtherBank', 'fromOtherBank'
    otherBankName: '',
    otherBankRoutingNumber: '',
    otherBankAccountNumber: ''
  });
  const [accountValidation, setAccountValidation] = useState(null);
  const [transferLimits, setTransferLimits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validatingAccount, setValidatingAccount] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [generatedTransactionId, setGeneratedTransactionId] = useState('');
  const [showTransactionId, setShowTransactionId] = useState(false);

  useEffect(() => {
    // Set default from account to current user's employee ID
    if (user?.employeeId) {
      setTransferData(prev => ({ ...prev, fromAccount: user.employeeId }));
      fetchTransferLimits(user.employeeId);
      fetchRecentTransfers();
    }
  }, [user]);

  const fetchTransferLimits = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/transfers/limits/${employeeId}`);
      if (response.ok) {
        const limits = await response.json();
        setTransferLimits(limits);
      }
    } catch (err) {
      console.error('Failed to fetch transfer limits:', err);
    }
  };

  const fetchRecentTransfers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/transactions');
      if (response.ok) {
        const transactions = await response.json();
        // Filter for transfer transactions and show recent ones
        const transferTransactions = transactions
          .filter(t => t.transactionType === 'TRANSFER')
          .slice(0, 5);
        setRecentTransfers(transferTransactions);
      }
    } catch (err) {
      console.error('Failed to fetch recent transfers:', err);
    }
  };

  const validateAccount = async (accountNumber) => {
    if (!accountNumber || accountNumber === transferData.fromAccount) {
      setAccountValidation(null);
      return;
    }

    setValidatingAccount(true);
    try {
      const response = await fetch(`http://localhost:8080/api/transfers/validate-account/${accountNumber}`);
      if (response.ok) {
        const validation = await response.json();
        setAccountValidation(validation);
        setError('');
      } else if (response.status === 404) {
        setAccountValidation({ valid: false, error: 'Account not found' });
        setError('Recipient account not found');
      }
    } catch (err) {
      setAccountValidation({ valid: false, error: 'Validation failed' });
      setError('Failed to validate account');
    } finally {
      setValidatingAccount(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData(prev => ({ ...prev, [name]: value }));
    
    // Reset account validation when transfer type or account changes
    if (name === 'transferType' || name === 'toAccount' || name === 'otherBankAccountNumber') {
      setAccountValidation(null);
    }
    
    // Validate account based on transfer type
    if (name === 'toAccount' && transferData.transferType === 'withinBank') {
      if (value.length >= 3) {
        const timeoutId = setTimeout(() => validateAccount(value), 500);
        return () => clearTimeout(timeoutId);
      }
    } else if (name === 'otherBankAccountNumber' && transferData.transferType === 'toOtherBank') {
      if (value.length >= 3) {
        const timeoutId = setTimeout(() => validateExternalAccount(value), 500);
        return () => clearTimeout(timeoutId);
      }
    }
    
    // Clear messages when user starts typing
    if (error || success) {
      setError('');
      setSuccess('');
    }
  };

  const validateTransfer = () => {
    // Validate based on transfer type
    if (transferData.transferType === 'withinBank') {
      if (!transferData.fromAccount || !transferData.toAccount || !transferData.amount) {
        setError('All fields are required');
        return false;
      }

      if (transferData.fromAccount === transferData.toAccount) {
        setError('Cannot transfer to the same account');
        return false;
      }
    } else if (transferData.transferType === 'toOtherBank') {
      if (!transferData.fromAccount || !transferData.otherBankAccountNumber || !transferData.otherBankName || !transferData.otherBankRoutingNumber || !transferData.amount) {
        setError('All fields are required for external transfer');
        return false;
      }
    } else if (transferData.transferType === 'fromOtherBank') {
      if (!transferData.toAccount || !transferData.otherBankAccountNumber || !transferData.otherBankName || !transferData.otherBankRoutingNumber || !transferData.amount) {
        setError('All fields are required for external transfer');
        return false;
      }
    }

    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }

    if (transferLimits) {
      const perTransactionLimit = parseFloat(transferLimits.perTransactionLimit);
      if (amount > perTransactionLimit) {
        setError(`Amount exceeds per-transaction limit of $${perTransactionLimit.toLocaleString()}`);
        return false;
      }
    }

    if (transferData.transferType === 'withinBank' && !accountValidation?.valid) {
      setError('Please validate the recipient account');
      return false;
    }

    return true;
  };

  const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const prefix = transferData.transferType === 'withinBank' ? 'INT' : 'EXT';
    return `${prefix}${timestamp}${random}`;
  };

  const validateExternalAccount = async (accountNumber) => {
    setValidatingAccount(true);
    try {
      // Simulate external account validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccountValidation({ 
        valid: true, 
        accountHolder: 'External Account Holder',
        accountType: 'External',
        message: 'External account validated successfully'
      });
      setError('');
    } catch (err) {
      setAccountValidation({ valid: false, error: 'External account validation failed' });
      setError('Failed to validate external account');
    } finally {
      setValidatingAccount(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!validateTransfer()) return;

    // Generate transaction ID and show confirmation
    const transactionId = generateTransactionId();
    setGeneratedTransactionId(transactionId);
    setShowTransactionId(true);
    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        transactionId: generatedTransactionId,
        transferType: transferData.transferType,
        amount: parseFloat(transferData.amount),
        description: transferData.description || 'Money Transfer'
      };

      if (transferData.transferType === 'withinBank') {
        payload.fromAccount = transferData.fromAccount;
        payload.toAccount = transferData.toAccount;
      } else if (transferData.transferType === 'toOtherBank') {
        payload.fromAccount = transferData.fromAccount;
        payload.toAccount = transferData.otherBankAccountNumber;
        payload.otherBankName = transferData.otherBankName;
        payload.otherBankRoutingNumber = transferData.otherBankRoutingNumber;
      } else if (transferData.transferType === 'fromOtherBank') {
        payload.fromAccount = transferData.otherBankAccountNumber;
        payload.toAccount = transferData.toAccount;
        payload.otherBankName = transferData.otherBankName;
        payload.otherBankRoutingNumber = transferData.otherBankRoutingNumber;
      }

      const response = await fetch('http://localhost:8080/api/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.isHighRisk) {
          setSuccess('Transfer completed but flagged for review due to high-risk amount');
        } else {
          setSuccess('Transfer completed successfully');
        }

        // Reset form and close confirmation
        resetForm();
        setShowConfirmation(false);

        // Refresh recent transfers
        fetchRecentTransfers();

      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Transfer failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTransferData(prev => ({
      ...prev,
      toAccount: '',
      amount: '',
      description: '',
      otherBankName: '',
      otherBankRoutingNumber: '',
      otherBankAccountNumber: ''
    }));
    setAccountValidation(null);
    setGeneratedTransactionId('');
    setShowTransactionId(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Money Transfer</h1>
        <p className="text-gray-600">Transfer money between accounts securely</p>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <ArrowUpDown className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Initiate Transfer</h2>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4">
              {/* Transfer Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative">
                    <input
                      type="radio"
                      id="withinBank"
                      name="transferType"
                      value="withinBank"
                      checked={transferData.transferType === 'withinBank'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="withinBank"
                      className={`block p-3 border-2 rounded-lg cursor-pointer text-center transition-colors ${
                        transferData.transferType === 'withinBank'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Account → Account</div>
                      <div className="text-xs text-gray-500">Within bank</div>
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="radio"
                      id="toOtherBank"
                      name="transferType"
                      value="toOtherBank"
                      checked={transferData.transferType === 'toOtherBank'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="toOtherBank"
                      className={`block p-3 border-2 rounded-lg cursor-pointer text-center transition-colors ${
                        transferData.transferType === 'toOtherBank'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ArrowRight className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Account → Other Bank</div>
                      <div className="text-xs text-gray-500">External transfer</div>
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="radio"
                      id="fromOtherBank"
                      name="transferType"
                      value="fromOtherBank"
                      checked={transferData.transferType === 'fromOtherBank'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="fromOtherBank"
                      className={`block p-3 border-2 rounded-lg cursor-pointer text-center transition-colors ${
                        transferData.transferType === 'fromOtherBank'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Other Bank → Account</div>
                      <div className="text-xs text-gray-500">Receive from external</div>
                    </label>
                  </div>
                </div>
              </div>

              {/* From Account */}
              {(transferData.transferType === 'withinBank' || transferData.transferType === 'toOtherBank') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Account
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="fromAccount"
                      value={transferData.fromAccount}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Your account (disabled)</p>
                </div>
              )}

              {/* To Account - Within Bank */}
              {transferData.transferType === 'withinBank' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Account *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="toAccount"
                      value={transferData.toAccount}
                      onChange={handleInputChange}
                      placeholder="Enter recipient account number"
                      className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        accountValidation?.valid ? 'border-green-500' : 
                        accountValidation?.valid === false ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {validatingAccount && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Account Validation Result */}
                  {accountValidation && (
                    <div className={`mt-2 text-sm ${
                      accountValidation.valid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {accountValidation.valid ? (
                        <div>
                          <span className="font-medium">✓ Valid Account</span>
                          <div className="text-xs mt-1">
                            {accountValidation.accountHolder} • {accountValidation.accountType}
                          </div>
                        </div>
                      ) : (
                        <span>✗ {accountValidation.error}</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* External Bank Details */}
              {(transferData.transferType === 'toOtherBank' || transferData.transferType === 'fromOtherBank') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="otherBankName"
                      value={transferData.otherBankName}
                      onChange={handleInputChange}
                      placeholder="Enter bank name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Routing Number *
                    </label>
                    <input
                      type="text"
                      name="otherBankRoutingNumber"
                      value={transferData.otherBankRoutingNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 9-digit routing number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={9}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {transferData.transferType === 'toOtherBank' ? 'Recipient' : 'Sender'} Account Number *
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="otherBankAccountNumber"
                        value={transferData.otherBankAccountNumber}
                        onChange={handleInputChange}
                        placeholder="Enter external account number"
                        className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          accountValidation?.valid ? 'border-green-500' : 
                          accountValidation?.valid === false ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {validatingAccount && (
                        <div className="absolute right-3 top-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* External Account Validation Result */}
                    {accountValidation && (
                      <div className={`mt-2 text-sm ${
                        accountValidation.valid ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {accountValidation.valid ? (
                          <div>
                            <span className="font-medium">✓ External Account Validated</span>
                            <div className="text-xs mt-1">
                              {accountValidation.message}
                            </div>
                          </div>
                        ) : (
                          <span>✗ {accountValidation.error}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* To Account - From Other Bank */}
              {transferData.transferType === 'fromOtherBank' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Account *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="toAccount"
                      value={transferData.toAccount}
                      onChange={handleInputChange}
                      placeholder="Enter your account number"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Your account to receive funds</p>
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="amount"
                    value={transferData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                {/* Transfer Limits Info */}
                {transferLimits && (
                  <div className="mt-2 text-xs text-gray-500">
                    <div>Per-transaction limit: {formatCurrency(transferLimits.perTransactionLimit)}</div>
                    <div>Daily limit: {formatCurrency(transferLimits.dailyLimit)}</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={transferData.description}
                  onChange={handleInputChange}
                  placeholder="Add a note (optional)"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Review Transfer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Recent Transfers Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transfers</h3>
            {recentTransfers.length > 0 ? (
              <div className="space-y-3">
                {recentTransfers.map((transfer) => (
                  <div key={transfer.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transfer.description || 'Money Transfer'}
                        </p>
                        <p className="text-xs text-gray-500">
                          To: {transfer.accountNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(transfer.transactionTime)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(transfer.amount)}
                        </p>
                        {transfer.flagged && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Flagged
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent transfers</p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Confirm Transfer</h3>
              </div>
              
              {/* Transaction ID Display */}
              {showTransactionId && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Transaction ID:</span>
                    <div className="flex items-center">
                      <span className="font-mono text-sm text-blue-900">{generatedTransactionId}</span>
                      <button
                        type="button"
                        onClick={() => setShowTransactionId(!showTransactionId)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        {showTransactionId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transfer Type:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {transferData.transferType === 'withinBank' ? 'Account → Account (Within Bank)' :
                     transferData.transferType === 'toOtherBank' ? 'Account → Other Bank' :
                     'Other Bank → Account'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(transferData.amount)}</span>
                </div>
                
                {transferData.transferType === 'withinBank' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">From Account:</span>
                      <span className="text-sm font-medium text-gray-900">{transferData.fromAccount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">To Account:</span>
                      <span className="text-sm font-medium text-gray-900">{transferData.toAccount}</span>
                    </div>
                  </>
                )}
                
                {(transferData.transferType === 'toOtherBank' || transferData.transferType === 'fromOtherBank') && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bank:</span>
                      <span className="text-sm font-medium text-gray-900">{transferData.otherBankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Routing Number:</span>
                      <span className="text-sm font-medium text-gray-900">{transferData.otherBankRoutingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">External Account:</span>
                      <span className="text-sm font-medium text-gray-900">{transferData.otherBankAccountNumber}</span>
                    </div>
                  </>
                )}
                
                {transferData.description && (
                  <div>
                    <span className="text-sm text-gray-600">Description:</span>
                    <p className="text-sm text-gray-900 mt-1">{transferData.description}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmTransfer}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Confirm Transfer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferPage;
