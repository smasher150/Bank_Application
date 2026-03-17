package com.bank.fraud.controller;

import com.bank.fraud.model.Transaction;
import com.bank.fraud.model.Employee;
import com.bank.fraud.service.TransferService;
import com.bank.fraud.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/transfers")
@CrossOrigin(origins = "http://localhost:3000")
public class TransferController {
    
    @Autowired
    private TransferService transferService;
    
    @Autowired
    private EmployeeService employeeService;
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> initiateTransfer(
            @RequestBody Map<String, Object> transferRequest,
            Authentication authentication) {
        
        try {
            String transactionId = (String) transferRequest.get("transactionId");
            String transferType = (String) transferRequest.get("transferType");
            String fromAccount = (String) transferRequest.get("fromAccount");
            String toAccount = (String) transferRequest.get("toAccount");
            BigDecimal amount = new BigDecimal(transferRequest.get("amount").toString());
            String description = (String) transferRequest.get("description");
            String initiatedBy = authentication.getName();
            
            // External bank details (for external transfers)
            String otherBankName = (String) transferRequest.get("otherBankName");
            String otherBankRoutingNumber = (String) transferRequest.get("otherBankRoutingNumber");
            
            // Validate transfer
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Transfer amount must be positive"
                ));
            }
            
            // Validate required fields based on transfer type
            if ("withinBank".equals(transferType)) {
                if (fromAccount == null || toAccount == null) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "error", "From and to accounts are required for internal transfers"
                    ));
                }
                
                // Check if accounts exist and get employee info
                Optional<Employee> fromEmployee = employeeService.getEmployeeByAccountNumber(fromAccount);
                Optional<Employee> toEmployee = employeeService.getEmployeeByAccountNumber(toAccount);
                
                if (fromEmployee.isEmpty() || toEmployee.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "error", "Invalid account numbers"
                    ));
                }
                
                // Initiate transfer
                Transaction transaction = transferService.initiateTransfer(
                    transactionId, fromAccount, toAccount, amount, description, initiatedBy, transferType
                );
                
                // Check for fraud risk
                boolean isHighRisk = assessTransactionRisk(transaction);
                
                if (isHighRisk) {
                    transaction.setRiskLevel(Transaction.RiskLevel.HIGH);
                    transaction.setFlagged(true);
                    transaction.setFlagReason("High-risk transaction detected");
                    
                    // Create fraud alert
                    createFraudAlertForTransaction(transaction);
                }
                
                // Update employee profiles with transaction info
                updateEmployeeProfiles(fromEmployee.get(), toEmployee.get(), transaction);
                
                Map<String, Object> response = new HashMap<>();
                response.put("transaction", transaction);
                response.put("isHighRisk", isHighRisk);
                response.put("message", isHighRisk ?
                    "Transfer completed but flagged for review" :
                    "Transfer completed successfully");
                response.put("fromEmployee", fromEmployee.get());
                response.put("toEmployee", toEmployee.get());
                
                return ResponseEntity.ok(response);
                
            } else if ("toOtherBank".equals(transferType) || "fromOtherBank".equals(transferType)) {
                // Validate external transfer fields
                if (otherBankName == null || otherBankRoutingNumber == null) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "error", "Bank name and routing number are required for external transfers"
                    ));
                }
                
                // For external transfers, we still need to validate the internal account
                String internalAccount = "toOtherBank".equals(transferType) ? fromAccount : toAccount;
                Optional<Employee> internalEmployee = employeeService.getEmployeeByAccountNumber(internalAccount);
                
                if (internalEmployee.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "error", "Invalid internal account number"
                    ));
                }
                
                // Initiate external transfer
                Transaction transaction = transferService.initiateTransfer(
                    transactionId, fromAccount, toAccount, amount, description, initiatedBy, transferType
                );
                
                // Add external bank details to transaction description
                String enhancedDescription = description + " [External: " + otherBankName + ", Routing: " + otherBankRoutingNumber + "]";
                transaction.setDescription(enhancedDescription);
                
                // External transfers have higher risk assessment
                boolean isHighRisk = assessTransactionRisk(transaction) || amount.compareTo(new BigDecimal("10000.00")) > 0;
                
                if (isHighRisk) {
                    transaction.setRiskLevel(Transaction.RiskLevel.HIGH);
                    transaction.setFlagged(true);
                    transaction.setFlagReason("External transfer - high risk");
                    
                    // Create fraud alert
                    createFraudAlertForTransaction(transaction);
                }
                
                // Update internal employee profile
                updateEmployeeProfiles(internalEmployee.get(), internalEmployee.get(), transaction);
                
                Map<String, Object> response = new HashMap<>();
                response.put("transaction", transaction);
                response.put("isHighRisk", isHighRisk);
                response.put("message", isHighRisk ?
                    "External transfer completed but flagged for review" :
                    "External transfer completed successfully");
                response.put("transferType", transferType);
                response.put("externalBank", otherBankName);
                
                return ResponseEntity.ok(response);
                
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid transfer type"
                ));
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Transfer failed: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/validate-account/{accountNumber}")
    public ResponseEntity<Map<String, Object>> validateAccount(@PathVariable String accountNumber) {
        try {
            Optional<Employee> employee = employeeService.getEmployeeByAccountNumber(accountNumber);
            
            if (employee.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Employee emp = employee.get();
            Map<String, Object> response = Map.of(
                "valid", true,
                "accountHolder", emp.getFirstName() + " " + emp.getLastName(),
                "accountType", emp.getDepartment(),
                "employeeId", emp.getEmployeeId()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Account validation failed: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/limits/{employeeId}")
    public ResponseEntity<Map<String, Object>> getTransferLimits(@PathVariable String employeeId) {
        try {
            Map<String, Object> limits = transferService.getTransferLimits(employeeId);
            return ResponseEntity.ok(limits);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to get transfer limits: " + e.getMessage()
            ));
        }
    }
    
    private void updateEmployeeProfiles(Employee fromEmployee, Employee toEmployee, Transaction transaction) {
        // Update last transaction activity using transactionTime
        fromEmployee.setUpdatedAt(transaction.getTransactionTime());
        toEmployee.setUpdatedAt(transaction.getTransactionTime());
        
        // Note: In a real implementation, you would track transaction counts
        // For now, we'll just update the timestamp
        
        // Save updated profiles
        employeeService.updateEmployee(fromEmployee);
        employeeService.updateEmployee(toEmployee);
    }
    
    // Simple fraud risk assessment
    private boolean assessTransactionRisk(Transaction transaction) {
        // Simple risk assessment based on amount
        return transaction.getAmount().compareTo(new BigDecimal("25000.00")) > 0;
    }
    
    // Create fraud alert for high-risk transaction
    private void createFraudAlertForTransaction(Transaction transaction) {
        // In a real implementation, this would create a proper fraud alert
        // For now, we'll just log it (method stub)
        System.out.println("High-risk transaction detected: " + transaction.getTransactionId());
    }
}
