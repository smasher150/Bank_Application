package com.bank.fraud.repository;

import com.bank.fraud.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByEmployeeEmployeeId(String employeeId);
    
    List<Transaction> findByEmployeeEmployeeIdAndFlagged(String employeeId, boolean flagged);
    
    List<Transaction> findByAccountNumber(String accountNumber);
    
    List<Transaction> findByFlagged(boolean flagged);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.employee.employeeId = :employeeId AND t.transactionTime >= :since")
    long countTransactionsSince(@Param("employeeId") String employeeId, @Param("since") LocalDateTime since);
    
    @Query("SELECT t FROM Transaction t WHERE t.employee.employeeId = :employeeId AND t.transactionTime BETWEEN :start AND :end")
    List<Transaction> findByEmployeeAndTimeRange(@Param("employeeId") String employeeId, 
                                                   @Param("start") LocalDateTime startTime, 
                                                   @Param("end") LocalDateTime endTime);
    
    List<Transaction> findByRiskLevel(Transaction.RiskLevel riskLevel);
    
    @Query("SELECT t FROM Transaction t WHERE t.amount > :amount")
    List<Transaction> findByAmountGreaterThan(@Param("amount") BigDecimal amount);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.employee.employeeId = :employeeId AND t.transactionTime BETWEEN :start AND :end")
    BigDecimal sumTransactionsByEmployeeAndTimeRange(@Param("employeeId") String employeeId, 
                                                    @Param("start") LocalDateTime start, 
                                                    @Param("end") LocalDateTime end);
    
    @Query("SELECT t FROM Transaction t WHERE t.ipAddress = :ipAddress AND t.transactionTime >= :since")
    List<Transaction> findByIpAddressSince(@Param("ipAddress") String ipAddress, @Param("since") LocalDateTime since);
}
