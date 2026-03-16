package com.bank.fraud.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class FraudAlertDTO {
    
    private Long id;
    
    @NotNull(message = "Employee ID is required")
    private Long employeeId;
    
    private Long transactionId;
    
    @NotBlank(message = "Alert type is required")
    private String alertType;
    
    @NotBlank(message = "Severity is required")
    private String severity;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private LocalDateTime alertTime;
    
    private String status;
    
    private LocalDateTime resolvedAt;
    
    private String resolutionNotes;
    
    private Long resolvedBy;

    // Constructors
    public FraudAlertDTO() {}

    public FraudAlertDTO(Long employeeId, String alertType, String severity, String description) {
        this.employeeId = employeeId;
        this.alertType = alertType;
        this.severity = severity;
        this.description = description;
        this.alertTime = LocalDateTime.now();
        this.status = "OPEN";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public String getAlertType() {
        return alertType;
    }

    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getAlertTime() {
        return alertTime;
    }

    public void setAlertTime(LocalDateTime alertTime) {
        this.alertTime = alertTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public Long getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(Long resolvedBy) {
        this.resolvedBy = resolvedBy;
    }
}
