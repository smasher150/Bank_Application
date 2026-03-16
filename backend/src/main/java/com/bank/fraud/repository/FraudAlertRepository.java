package com.bank.fraud.repository;

import com.bank.fraud.model.FraudAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {
    
    List<FraudAlert> findByEmployeeEmployeeId(String employeeId);
    
    List<FraudAlert> findByStatus(FraudAlert.AlertStatus status);
    
    List<FraudAlert> findBySeverity(FraudAlert.SeverityLevel severity);
    
    List<FraudAlert> findByAlertType(FraudAlert.AlertType alertType);
    
    @Query("SELECT fa FROM FraudAlert fa WHERE fa.alertTime BETWEEN :start AND :end")
    List<FraudAlert> findByTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(fa) FROM FraudAlert fa WHERE fa.employee.employeeId = :employeeId AND fa.status = :status")
    long countByEmployeeAndStatus(@Param("employeeId") String employeeId, @Param("status") FraudAlert.AlertStatus status);
    
    @Query("SELECT COUNT(fa) FROM FraudAlert fa WHERE fa.severity = :severity AND fa.status = 'OPEN'")
    long countOpenAlertsBySeverity(@Param("severity") FraudAlert.SeverityLevel severity);
    
    @Query("SELECT fa FROM FraudAlert fa WHERE fa.status IN ('OPEN', 'INVESTIGATING') ORDER BY fa.severity DESC, fa.alertTime DESC")
    List<FraudAlert> findActiveAlerts();
    
    @Query("SELECT fa.alertType, COUNT(fa) FROM FraudAlert fa WHERE fa.alertTime >= :since GROUP BY fa.alertType")
    List<Object[]> getAlertTypeStatistics(@Param("since") LocalDateTime since);
    
    @Query("SELECT fa FROM FraudAlert fa WHERE fa.employee.id = :employeeId")
    List<FraudAlert> findByEmployeeId(@Param("employeeId") Long employeeId);
    
    long countByStatus(String status);
    
    long countBySeverity(String severity);
    
    @Query("SELECT fa FROM FraudAlert fa ORDER BY fa.alertTime DESC")
    List<FraudAlert> findTopAlerts();
    
    @Query("SELECT fa.alertType, COUNT(fa) FROM FraudAlert fa GROUP BY fa.alertType")
    List<Object[]> getAlertsByType();
    
    @Query("SELECT fa.employee.id, COUNT(fa) FROM FraudAlert fa GROUP BY fa.employee.id")
    List<Object[]> getAlertsByEmployee();
    
    List<FraudAlert> findByStatusIn(List<FraudAlert.AlertStatus> statuses);
}
