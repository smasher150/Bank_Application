package com.bank.fraud.controller;

import com.bank.fraud.dto.FraudAlertDTO;
import com.bank.fraud.model.FraudAlert;
import com.bank.fraud.service.FraudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fraud")
@CrossOrigin(origins = "http://localhost:3000")
public class FraudController {
    
    @Autowired
    private FraudService fraudService;

    @GetMapping("/alerts")
    public ResponseEntity<List<FraudAlert>> getAllFraudAlerts() {
        List<FraudAlert> alerts = fraudService.getAllFraudAlerts();
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/alerts/{id}")
    public ResponseEntity<FraudAlert> getFraudAlertById(@NonNull @PathVariable Long id) {
        FraudAlert alert = fraudService.getFraudAlertById(id).orElseThrow(() -> new RuntimeException("Fraud alert not found"));
        return ResponseEntity.ok(alert);
    }

    @PostMapping("/alerts")
    public ResponseEntity<FraudAlert> createFraudAlert(@RequestBody FraudAlertDTO fraudAlertDTO) {
        FraudAlert createdAlert = fraudService.createFraudAlert(fraudAlertDTO);
        return ResponseEntity.ok(createdAlert);
    }

    @PutMapping("/alerts/{id}/resolve")
    public ResponseEntity<FraudAlert> resolveFraudAlert(
            @NonNull @PathVariable Long id,
            @RequestParam String resolutionNotes,
            @NonNull @RequestParam Long resolvedBy) {
        FraudAlert resolvedAlert = fraudService.resolveFraudAlert(id, resolutionNotes, resolvedBy);
        return ResponseEntity.ok(resolvedAlert);
    }

    @GetMapping("/alerts/employee/{employeeId}")
    public ResponseEntity<List<FraudAlert>> getFraudAlertsByEmployee(@PathVariable Long employeeId) {
        List<FraudAlert> alerts = fraudService.getFraudAlertsByEmployee(employeeId);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/alerts/severity/{severity}")
    public ResponseEntity<List<FraudAlert>> getFraudAlertsBySeverity(@PathVariable String severity) {
        List<FraudAlert> alerts = fraudService.getFraudAlertsBySeverity(severity);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/alerts/status/{status}")
    public ResponseEntity<List<FraudAlert>> getFraudAlertsByStatus(@PathVariable String status) {
        List<FraudAlert> alerts = fraudService.getFraudAlertsByStatus(status);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/stats")
    public ResponseEntity<Object> getFraudStats() {
        Object stats = fraudService.getFraudStats();
        return ResponseEntity.ok(stats);
    }
}
