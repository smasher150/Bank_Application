package com.bank.fraud.service;

import com.bank.fraud.dto.FraudAlertDTO;
import com.bank.fraud.model.FraudAlert;
import com.bank.fraud.repository.FraudAlertRepository;
import com.bank.fraud.repository.EmployeeRepository;
import com.bank.fraud.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FraudService {

    // IDE refresh trigger

    @Autowired
    private FraudAlertRepository fraudAlertRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;

    public List<FraudAlert> getAllFraudAlerts() {
        return fraudAlertRepository.findAll();
    }

    public Optional<FraudAlert> getFraudAlertById(@NonNull Long id) {
        return fraudAlertRepository.findById(id);
    }

    public FraudAlert createFraudAlert(FraudAlertDTO fraudAlertDTO) {
        FraudAlert fraudAlert = new FraudAlert();
        Long employeeId = fraudAlertDTO.getEmployeeId();
        if (employeeId != null && employeeId != 0L) {
            fraudAlert.setEmployee(employeeRepository.findById(employeeId).orElse(null));
        }
        Long transactionId = fraudAlertDTO.getTransactionId();
        if (transactionId != null && transactionId != 0L) {
            fraudAlert.setTransaction(transactionRepository.findById(transactionId).orElse(null));
        }
        fraudAlert.setAlertType(FraudAlert.AlertType.valueOf(fraudAlertDTO.getAlertType()));
        fraudAlert.setSeverity(FraudAlert.SeverityLevel.valueOf(fraudAlertDTO.getSeverity()));
        fraudAlert.setDescription(fraudAlertDTO.getDescription());
        fraudAlert.setAlertTime(fraudAlertDTO.getAlertTime());
        fraudAlert.setStatus(FraudAlert.AlertStatus.valueOf(fraudAlertDTO.getStatus()));

        return fraudAlertRepository.save(fraudAlert);
    }

    public FraudAlert resolveFraudAlert(@NonNull Long id, String resolutionNotes, @NonNull Long resolvedBy) {
        Optional<FraudAlert> alertOpt = fraudAlertRepository.findById(id);
        if (alertOpt.isEmpty()) {
            throw new RuntimeException("Fraud alert not found with id: " + id);
        }

        FraudAlert alert = alertOpt.get();
        alert.setStatus(FraudAlert.AlertStatus.RESOLVED);
        alert.setResolutionNotes(resolutionNotes);
        alert.setResolvedAt(LocalDateTime.now());
        alert.setResolvedBy(resolvedBy);

        return fraudAlertRepository.save(alert);
    }

    public List<FraudAlert> getFraudAlertsByEmployee(Long employeeId) {
        return fraudAlertRepository.findByEmployeeId(employeeId);
    }

    public List<FraudAlert> getFraudAlertsBySeverity(String severity) {
        return fraudAlertRepository.findBySeverity(FraudAlert.SeverityLevel.valueOf(severity));
    }

    public List<FraudAlert> getFraudAlertsByStatus(String status) {
        return fraudAlertRepository.findByStatus(FraudAlert.AlertStatus.valueOf(status));
    }

    public Map<String, Object> getFraudStats() {
        Map<String, Object> stats = Map.of(
            "totalAlerts", fraudAlertRepository.count(),
            "openAlerts", fraudAlertRepository.countByStatus("OPEN"),
            "investigatingAlerts", fraudAlertRepository.countByStatus("INVESTIGATING"),
            "resolvedAlerts", fraudAlertRepository.countByStatus("RESOLVED"),
            "criticalAlerts", fraudAlertRepository.countBySeverity("CRITICAL"),
            "highAlerts", fraudAlertRepository.countBySeverity("HIGH"),
            "mediumAlerts", fraudAlertRepository.countBySeverity("MEDIUM"),
            "lowAlerts", fraudAlertRepository.countBySeverity("LOW")
        );
        return stats;
    }

    public List<FraudAlert> getRecentAlerts(int limit) {
        List<FraudAlert> allAlerts = fraudAlertRepository.findTopAlerts();
        return allAlerts.stream().limit(limit).collect(java.util.stream.Collectors.toList());
    }

    public List<Map<String, Object>> getAlertsByType() {
        List<Object[]> results = fraudAlertRepository.getAlertsByType();
        return results.stream()
                .map(row -> Map.of(
                    "type", row[0],
                    "count", row[1]
                ))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAlertsByEmployee() {
        List<Object[]> results = fraudAlertRepository.getAlertsByEmployee();
        return results.stream()
                .map(row -> Map.of(
                    "employeeId", row[0],
                    "alertCount", row[1]
                ))
                .collect(Collectors.toList());
    }

    public List<FraudAlert> getActiveAlerts() {
        return fraudAlertRepository.findByStatusIn(List.of(FraudAlert.AlertStatus.OPEN, FraudAlert.AlertStatus.INVESTIGATING));
    }
}
