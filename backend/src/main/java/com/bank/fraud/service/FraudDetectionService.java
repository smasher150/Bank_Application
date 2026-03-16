package com.bank.fraud.service;

import com.bank.fraud.model.Transaction;
import com.bank.fraud.model.FraudAlert;
import com.bank.fraud.model.Employee;
import com.bank.fraud.repository.TransactionRepository;
import com.bank.fraud.repository.FraudAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FraudDetectionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private FraudAlertRepository fraudAlertRepository;
    
    public void analyzeTransaction(Transaction transaction) {
        // Check for unusual amounts
        if (isUnusualAmount(transaction)) {
            createFraudAlert(transaction, FraudAlert.AlertType.UNUSUAL_AMOUNT, 
                           FraudAlert.SeverityLevel.HIGH, 
                           "Transaction amount exceeds typical threshold");
        }
        
        // Check for frequent transactions
        if (hasFrequentTransactions(transaction.getEmployee())) {
            createFraudAlert(transaction, FraudAlert.AlertType.FREQUENT_TRANSACTIONS, 
                           FraudAlert.SeverityLevel.MEDIUM, 
                           "High frequency of transactions detected");
        }
        
        // Check for off-hours activity
        if (isOffHoursActivity(transaction)) {
            createFraudAlert(transaction, FraudAlert.AlertType.OFF_HOURS_ACTIVITY, 
                           FraudAlert.SeverityLevel.MEDIUM, 
                           "Transaction occurred outside normal business hours");
        }
        
        // Check for rapid succession transactions
        if (hasRapidSuccessionTransactions(transaction.getEmployee())) {
            createFraudAlert(transaction, FraudAlert.AlertType.RAPID_SUCCESSION, 
                           FraudAlert.SeverityLevel.HIGH, 
                           "Multiple transactions in rapid succession");
        }
        
        // Check for location anomalies
        if (hasLocationAnomaly(transaction)) {
            createFraudAlert(transaction, FraudAlert.AlertType.LOCATION_ANOMALY, 
                           FraudAlert.SeverityLevel.CRITICAL, 
                           "Transaction from unusual IP address location");
        }
    }
    
    private boolean isUnusualAmount(Transaction transaction) {
        BigDecimal threshold = new BigDecimal("50000.00");
        return transaction.getAmount().compareTo(threshold) > 0;
    }
    
    private boolean hasFrequentTransactions(Employee employee) {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        long transactionCount = transactionRepository.countTransactionsSince(
            employee.getEmployeeId(), since);
        return transactionCount > 50; // More than 50 transactions in 24 hours
    }
    
    private boolean isOffHoursActivity(Transaction transaction) {
        int hour = transaction.getTransactionTime().getHour();
        return hour < 6 || hour > 22; // Before 6 AM or after 10 PM
    }
    
    private boolean hasRapidSuccessionTransactions(Employee employee) {
        LocalDateTime since = LocalDateTime.now().minusMinutes(5);
        List<Transaction> recentTransactions = transactionRepository.findByEmployeeAndTimeRange(
            employee.getEmployeeId(), since, LocalDateTime.now());
        return recentTransactions.size() > 5; // More than 5 transactions in 5 minutes
    }
    
    private boolean hasLocationAnomaly(Transaction transaction) {
        // Check if IP address is from unusual location
        String ipAddress = transaction.getIpAddress();
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        List<Transaction> pastTransactions = transactionRepository.findByIpAddressSince(ipAddress, since);
        
        // If this is the first transaction from this IP in 30 days
        return pastTransactions.isEmpty();
    }
    
    private void createFraudAlert(Transaction transaction, FraudAlert.AlertType alertType, 
                                 FraudAlert.SeverityLevel severity, String description) {
        String alertId = "ALERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        FraudAlert alert = new FraudAlert(alertId, transaction.getEmployee(), transaction, 
                                        alertType, severity, description, LocalDateTime.now());
        
        // Flag the transaction
        transaction.setFlagged(true);
        transaction.setFlagReason(description);
        transaction.setRiskLevel(mapSeverityToRiskLevel(severity));
        
        fraudAlertRepository.save(alert);
        transactionRepository.save(transaction);
    }
    
    private Transaction.RiskLevel mapSeverityToRiskLevel(FraudAlert.SeverityLevel severity) {
        switch (severity) {
            case LOW: return Transaction.RiskLevel.LOW;
            case MEDIUM: return Transaction.RiskLevel.MEDIUM;
            case HIGH: return Transaction.RiskLevel.HIGH;
            case CRITICAL: return Transaction.RiskLevel.CRITICAL;
            default: return Transaction.RiskLevel.LOW;
        }
    }
    
    public List<FraudAlert> getActiveAlerts() {
        return fraudAlertRepository.findActiveAlerts();
    }
    
    public void resolveAlert(@NonNull Long alertId, String resolutionNotes, @NonNull Long resolvedBy) {
        FraudAlert alert = fraudAlertRepository.findById(alertId)
            .orElseThrow(() -> new RuntimeException("Alert not found"));
        
        alert.setStatus(FraudAlert.AlertStatus.RESOLVED);
        alert.setResolutionNotes(resolutionNotes);
        alert.setResolvedBy(resolvedBy);
        alert.setResolvedAt(LocalDateTime.now());
        
        fraudAlertRepository.save(alert);
    }
}
