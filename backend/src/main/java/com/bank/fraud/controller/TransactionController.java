package com.bank.fraud.controller;

import com.bank.fraud.model.Transaction;
import com.bank.fraud.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@NonNull @PathVariable Long id) {
        Optional<Transaction> transaction = transactionService.getTransactionById(id);
        return transaction.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Transaction>> getTransactionsByEmployee(@PathVariable String employeeId) {
        List<Transaction> transactions = transactionService.getTransactionsByEmployee(employeeId);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccount(@PathVariable String accountNumber) {
        List<Transaction> transactions = transactionService.getTransactionsByAccount(accountNumber);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/flagged")
    public ResponseEntity<List<Transaction>> getFlaggedTransactions() {
        List<Transaction> transactions = transactionService.getFlaggedTransactions();
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/risk-level/{riskLevel}")
    public ResponseEntity<List<Transaction>> getTransactionsByRiskLevel(@PathVariable Transaction.RiskLevel riskLevel) {
        List<Transaction> transactions = transactionService.getTransactionsByRiskLevel(riskLevel);
        return ResponseEntity.ok(transactions);
    }
    
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        try {
            Transaction createdTransaction = transactionService.createTransaction(transaction);
            return ResponseEntity.ok(createdTransaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/employee/{employeeId}/time-range")
    public ResponseEntity<List<Transaction>> getTransactionsByEmployeeAndTimeRange(
            @PathVariable String employeeId,
            @RequestParam String start,
            @RequestParam String end) {
        
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        
        List<Transaction> transactions = transactionService.getTransactionsByEmployeeAndTimeRange(
            employeeId, startTime, endTime);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/high-value")
    public ResponseEntity<List<Transaction>> getHighValueTransactions(@RequestParam BigDecimal threshold) {
        List<Transaction> transactions = transactionService.getHighValueTransactions(threshold);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/employee/{employeeId}/total")
    public ResponseEntity<BigDecimal> getTotalTransactionsByEmployee(
            @PathVariable String employeeId,
            @RequestParam String start,
            @RequestParam String end) {
        
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        
        BigDecimal total = transactionService.getTotalTransactionsByEmployee(employeeId, startTime, endTime);
        return ResponseEntity.ok(total);
    }
    
    @GetMapping("/employee/{employeeId}/count")
    public ResponseEntity<Long> getTransactionCountByEmployee(
            @PathVariable String employeeId,
            @RequestParam String since) {
        
        LocalDateTime sinceTime = LocalDateTime.parse(since);
        long count = transactionService.getTransactionCountByEmployee(employeeId, sinceTime);
        return ResponseEntity.ok(count);
    }
    
    @PutMapping("/{id}/risk-level")
    public ResponseEntity<Transaction> updateTransactionRiskLevel(
            @NonNull @PathVariable Long id,
            @RequestParam Transaction.RiskLevel riskLevel) {
        try {
            Transaction updatedTransaction = transactionService.updateTransactionRiskLevel(id, riskLevel);
            return ResponseEntity.ok(updatedTransaction);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/flag")
    public ResponseEntity<Transaction> flagTransaction(
            @NonNull @PathVariable Long id,
            @RequestParam String reason) {
        try {
            Transaction flaggedTransaction = transactionService.flagTransaction(id, reason);
            return ResponseEntity.ok(flaggedTransaction);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
