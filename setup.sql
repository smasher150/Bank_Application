-- Bank Fraud Monitoring System Database Setup
-- Run this script to create the database and initial setup

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS bank_fraud_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE bank_fraud_db;

-- Create tables will be automatically created by Spring Boot JPA
-- But here's the manual structure for reference:

/*
-- Employees Table
CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'MANAGER', 'AUDITOR', 'TELLER', 'ANALYST') NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    employee_id BIGINT NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    transaction_type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT', 'REFUND', 'ADJUSTMENT') NOT NULL,
    description TEXT,
    ip_address VARCHAR(45) NOT NULL,
    device_info VARCHAR(255) NOT NULL,
    transaction_time TIMESTAMP NOT NULL,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'LOW',
    flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Fraud Alerts Table
CREATE TABLE fraud_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    alert_id VARCHAR(50) UNIQUE NOT NULL,
    employee_id BIGINT NOT NULL,
    transaction_id BIGINT,
    alert_type ENUM('UNUSUAL_AMOUNT', 'FREQUENT_TRANSACTIONS', 'OFF_HOURS_ACTIVITY', 'MULTIPLE_ACCOUNTS', 'RAPID_SUCCESSION', 'LOCATION_ANOMALY', 'PATTERN_DEVIATION') NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    description TEXT NOT NULL,
    alert_time TIMESTAMP NOT NULL,
    status ENUM('OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE') DEFAULT 'OPEN',
    resolved_at TIMESTAMP NULL,
    resolution_notes TEXT,
    resolved_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

-- Create indexes for better performance
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_employee_employee_id ON employees(employee_id);
CREATE INDEX idx_transaction_employee_id ON transactions(employee_id);
CREATE INDEX idx_transaction_flagged ON transactions(flagged);
CREATE INDEX idx_transaction_risk_level ON transactions(risk_level);
CREATE INDEX idx_fraud_alert_employee_id ON fraud_alerts(employee_id);
CREATE INDEX idx_fraud_alert_status ON fraud_alerts(status);
CREATE INDEX idx_fraud_alert_severity ON fraud_alerts(severity);
CREATE INDEX idx_fraud_alert_time ON fraud_alerts(alert_time);
*/

-- Sample data will be automatically created by the DataInitializer
-- But here's some manual sample data for reference:

/*
-- Insert sample employees (passwords are BCrypt encoded)
INSERT INTO employees (employee_id, first_name, last_name, email, department, position, role, active, password) VALUES
('ADMIN001', 'Admin', 'User', 'admin@bank.com', 'IT', 'System Administrator', 'ADMIN', TRUE, '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa'),
('EMP001', 'John', 'Smith', 'john.smith@bank.com', 'Retail Banking', 'Teller', 'TELLER', TRUE, '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa'),
('EMP002', 'Sarah', 'Johnson', 'sarah.johnson@bank.com', 'Commercial Banking', 'Relationship Manager', 'MANAGER', TRUE, '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa'),
('EMP003', 'Michael', 'Brown', 'michael.brown@bank.com', 'Audit', 'Internal Auditor', 'AUDITOR', TRUE, '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa');

-- Sample transactions
INSERT INTO transactions (transaction_id, employee_id, account_number, amount, transaction_type, description, ip_address, device_info, transaction_time) VALUES
('TXN-2024001', 2, '****1234', 15000.00, 'TRANSFER', 'Transfer to savings account', '192.168.1.100', 'Windows PC', '2024-01-15 10:30:00'),
('TXN-2024002', 3, '****5678', 500.00, 'DEPOSIT', 'Cash deposit', '192.168.1.101', 'Mobile Device', '2024-01-15 11:15:00'),
('TXN-2024003', 4, '****9012', 75000.00, 'WITHDRAWAL', 'Large cash withdrawal', '192.168.1.102', 'ATM Terminal', '2024-01-15 14:20:00');

-- Sample fraud alerts
INSERT INTO fraud_alerts (alert_id, employee_id, transaction_id, alert_type, severity, description, alert_time, status) VALUES
('ALERT-001', 2, 1, 'UNUSUAL_AMOUNT', 'HIGH', 'Transaction amount exceeds typical threshold for this employee', '2024-01-15 10:30:00', 'OPEN'),
('ALERT-002', 4, 3, 'OFF_HOURS_ACTIVITY', 'MEDIUM', 'Transaction occurred outside normal business hours', '2024-01-15 14:20:00', 'OPEN');
*/

-- Grant permissions (adjust username/password as needed)
-- CREATE USER 'bankuser'@'localhost' IDENTIFIED BY 'bankpassword';
-- GRANT ALL PRIVILEGES ON bank_fraud_db.* TO 'bankuser'@'localhost';
-- FLUSH PRIVILEGES;

SELECT 'Database setup completed successfully!' as message;
