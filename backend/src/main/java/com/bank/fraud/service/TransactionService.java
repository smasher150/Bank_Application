package com.bank.fraud.service;

import com.bank.fraud.model.Transaction;
import com.bank.fraud.model.Employee;
import com.bank.fraud.repository.TransactionRepository;
import com.bank.fraud.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private FraudDetectionService fraudDetectionService;
    
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    public Optional<Transaction> getTransactionById(@NonNull Long id) {
        return transactionRepository.findById(id);
    }
    
    public List<Transaction> getTransactionsByEmployee(String employeeId) {
        return transactionRepository.findByEmployeeEmployeeId(employeeId);
    }
    
    public List<Transaction> getTransactionsByAccount(String accountNumber) {
        return transactionRepository.findByAccountNumber(accountNumber);
    }
    
    public List<Transaction> getFlaggedTransactions() {
        return transactionRepository.findByFlagged(true);
    }
    
    public List<Transaction> getTransactionsByRiskLevel(Transaction.RiskLevel riskLevel) {
        return transactionRepository.findByRiskLevel(riskLevel);
    }
    
    public Transaction createTransaction(Transaction transaction) {
        // Generate transaction ID
        transaction.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        // Set transaction time if not provided
        if (transaction.getTransactionTime() == null) {
            transaction.setTransactionTime(LocalDateTime.now());
        }
        
        // Validate employee exists
        Employee employee = employeeRepository.findByEmployeeId(transaction.getEmployee().getEmployeeId())
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        transaction.setEmployee(employee);
        
        // Save transaction
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Analyze for fraud
        fraudDetectionService.analyzeTransaction(savedTransaction);
        
        return savedTransaction;
    }
    
    public List<Transaction> getTransactionsByEmployeeAndTimeRange(String employeeId, 
                                                                   LocalDateTime start, 
                                                                   LocalDateTime end) {
        return transactionRepository.findByEmployeeAndTimeRange(employeeId, start, end);
    }
    
    public List<Transaction> getHighValueTransactions(BigDecimal threshold) {
        return transactionRepository.findByAmountGreaterThan(threshold);
    }
    
    public BigDecimal getTotalTransactionsByEmployee(String employeeId, LocalDateTime start, LocalDateTime end) {
        return transactionRepository.sumTransactionsByEmployeeAndTimeRange(employeeId, start, end);
    }
    
    public long getTransactionCountByEmployee(String employeeId, LocalDateTime since) {
        return transactionRepository.countTransactionsSince(employeeId, since);
    }
    
    public List<Transaction> getTransactionsByIpAddress(String ipAddress, LocalDateTime since) {
        return transactionRepository.findByIpAddressSince(ipAddress, since);
    }
    
    public Transaction updateTransactionRiskLevel(@NonNull Long transactionId, Transaction.RiskLevel riskLevel) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        transaction.setRiskLevel(riskLevel);
        return transactionRepository.save(transaction);
    }
    
    public Transaction flagTransaction(@NonNull Long transactionId, String reason) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        transaction.setFlagged(true);
        transaction.setFlagReason(reason);
        return transactionRepository.save(transaction);
    }
}
