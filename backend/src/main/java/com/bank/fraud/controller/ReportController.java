package com.bank.fraud.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = Map.of(
                "totalEmployees", 1247,
                "activeAlerts", 23,
                "todayTransactions", 5642,
                "fraudRate", 2.3,
                "resolvedAlerts", 156,
                "criticalAlerts", 5);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/chart-data")
    public ResponseEntity<Map<String, Object>> getChartData() {
        Map<String, Object> data = Map.of(
                "weeklyData", new Object[] {
                        Map.of("name", "Mon", "alerts", 12, "transactions", 890),
                        Map.of("name", "Tue", "alerts", 19, "transactions", 1200),
                        Map.of("name", "Wed", "alerts", 15, "transactions", 950),
                        Map.of("name", "Thu", "alerts", 25, "transactions", 1400),
                        Map.of("name", "Fri", "alerts", 22, "transactions", 1100),
                        Map.of("name", "Sat", "alerts", 8, "transactions", 450),
                        Map.of("name", "Sun", "alerts", 5, "transactions", 300)
                });
        return ResponseEntity.ok(data);
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateReport(@RequestBody Map<String, Object> reportRequest) {
        // Mock report generation
        String reportId = "RPT-" + System.currentTimeMillis();
        Map<String, String> response = Map.of(
                "reportId", reportId,
                "status", "GENERATING",
                "message", "Report generation started successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/types")
    public ResponseEntity<Object> getReportTypes() {
        Object reportTypes = new Object[] {
                Map.of("id", "summary", "name", "Executive Summary", "description",
                        "High-level overview of fraud metrics"),
                Map.of("id", "alerts", "name", "Alert Analysis", "description", "Detailed analysis of fraud alerts"),
                Map.of("id", "employees", "name", "Employee Activity", "description", "Employee transaction patterns"),
                Map.of("id", "transactions", "name", "Transaction Report", "description",
                        "Comprehensive transaction analysis"),
                Map.of("id", "compliance", "name", "Compliance Report", "description",
                        "Regulatory compliance reporting")
        };
        return ResponseEntity.ok(reportTypes);
    }

    @GetMapping("/formats")
    public ResponseEntity<Object> getReportFormats() {
        Object formats = new Object[] {
                Map.of("id", "pdf", "name", "PDF", "description", "Portable Document Format"),
                Map.of("id", "excel", "name", "Excel", "description", "Microsoft Excel Spreadsheet"),
                Map.of("id", "csv", "name", "CSV", "description", "Comma Separated Values")
        };
        return ResponseEntity.ok(formats);
    }
}
