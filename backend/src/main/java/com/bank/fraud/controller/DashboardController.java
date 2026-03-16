package com.bank.fraud.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {
    
    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Mock data for demonstration
        stats.put("totalEmployees", 1247);
        stats.put("activeAlerts", 23);
        stats.put("todayTransactions", 5642);
        stats.put("fraudRate", 2.3);
        stats.put("resolvedAlerts", 156);
        stats.put("criticalAlerts", 5);
        
        return stats;
    }
    
    @GetMapping("/chart-data")
    public Map<String, Object> getChartData() {
        Map<String, Object> data = new HashMap<>();
        
        // Mock weekly data
        data.put("weeklyData", new Object[]{
            Map.of("name", "Mon", "alerts", 12, "transactions", 890),
            Map.of("name", "Tue", "alerts", 19, "transactions", 1200),
            Map.of("name", "Wed", "alerts", 15, "transactions", 950),
            Map.of("name", "Thu", "alerts", 25, "transactions", 1400),
            Map.of("name", "Fri", "alerts", 22, "transactions", 1100),
            Map.of("name", "Sat", "alerts", 8, "transactions", 450),
            Map.of("name", "Sun", "alerts", 5, "transactions", 300)
        });
        
        return data;
    }
}
