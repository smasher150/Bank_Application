package com.bank.fraud.service;

import com.bank.fraud.dto.FraudAlertDTO;
import com.bank.fraud.model.FraudAlert;
import com.bank.fraud.repository.TransactionRepository;
import com.bank.fraud.repository.FraudAlertRepository;
import com.bank.fraud.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FraudDetectionService_TEMP {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private FraudAlertRepository fraudAlertRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
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
}
