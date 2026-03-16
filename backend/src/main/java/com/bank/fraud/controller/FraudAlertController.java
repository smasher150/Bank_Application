package com.bank.fraud.controller;

import com.bank.fraud.model.FraudAlert;
import com.bank.fraud.service.FraudDetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fraud-alerts")
@CrossOrigin(origins = "http://localhost:3000")
public class FraudAlertController {
    
    @Autowired
    private FraudDetectionService fraudDetectionService;
    
    @GetMapping
    public ResponseEntity<List<FraudAlert>> getAllAlerts() {
        List<FraudAlert> alerts = fraudDetectionService.getActiveAlerts();
        return ResponseEntity.ok(alerts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FraudAlert> getAlertById(@PathVariable Long id) {
        // Implementation would depend on having a getAlertById method
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/resolve")
    public ResponseEntity<FraudAlert> resolveAlert(
            @NonNull @PathVariable Long id,
            @RequestParam String resolutionNotes,
            @NonNull @RequestParam Long resolvedBy) {
        try {
            fraudDetectionService.resolveAlert(id, resolutionNotes, resolvedBy);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
