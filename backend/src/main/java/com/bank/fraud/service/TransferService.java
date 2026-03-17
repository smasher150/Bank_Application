package com.bank.fraud.service;

import com.bank.fraud.model.Transaction;
import com.bank.fraud.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class TransferService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public Transaction initiateTransfer(String transactionId, String fromAccount, String toAccount,
                                            BigDecimal amount, String description, String initiatedBy, String transferType) {

        Transaction transaction = new Transaction();
        
        // Use provided transaction ID or generate one
        if (transactionId != null && !transactionId.isEmpty()) {
            transaction.setTransactionId(transactionId);
        } else {
            transaction.setTransactionId(generateTransactionReference());
        }
        
        transaction.setAccountNumber(fromAccount);
        transaction.setAmount(amount);
        transaction.setDescription(description != null ? description : "Money Transfer");
        transaction.setTransactionType(Transaction.TransactionType.TRANSFER);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setIpAddress("127.0.0.1");
        transaction.setDeviceInfo("Web Application");
        transaction.setRiskLevel(Transaction.RiskLevel.LOW);
        transaction.setFlagged(false);

        // Add transfer type information in description for tracking
        if (transferType != null) {
            String typeDescription = transferType.equals("withinBank") ? "Internal Transfer" :
                                    transferType.equals("toOtherBank") ? "External Transfer Out" :
                                    transferType.equals("fromOtherBank") ? "External Transfer In" :
                                    "Unknown Transfer Type";
            
            String enhancedDescription = transaction.getDescription() + " [" + typeDescription + "]";
            transaction.setDescription(enhancedDescription);
        }

        return transactionRepository.save(transaction);
    }

    // Keep the old method for backward compatibility
    public Transaction initiateTransfer(String fromAccount, String toAccount,
                                              BigDecimal amount, String description,
                                              String initiatedBy) {
        return initiateTransfer(null, fromAccount, toAccount, amount, description, initiatedBy, "withinBank");
    }
    
    public Map<String, Object> getTransferLimits(String employeeId) {
        Map<String, Object> limits = new HashMap<>();
        
        // Define transfer limits based on employee role or other criteria
        limits.put("dailyLimit", new BigDecimal("50000.00"));
        limits.put("perTransactionLimit", new BigDecimal("10000.00"));
        limits.put("monthlyLimit", new BigDecimal("500000.00"));
        limits.put("requiresApproval", new BigDecimal("25000.00"));
        
        return limits;
    }
    
    private String generateTransactionReference() {
        return "TRF" + System.currentTimeMillis() + (int)(Math.random() * 1000);
    }
}
