package com.bank.fraud.service;

import com.bank.fraud.dto.LoginRequest;
import com.bank.fraud.model.Employee;
import com.bank.fraud.repository.EmployeeRepository;
import com.bank.fraud.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> authenticate(LoginRequest loginRequest) {
        Optional<Employee> employeeOpt = employeeRepository.findByEmail(loginRequest.getEmail());
        
        if (employeeOpt.isEmpty()) {
            throw new RuntimeException("Employee not found with email: " + loginRequest.getEmail());
        }

        Employee employee = employeeOpt.get();
        
        if (!employee.isActive()) {
            throw new RuntimeException("Employee account is inactive");
        }

        // For demo purposes, we'll use simple password comparison
        // In production, use: passwordEncoder.matches(loginRequest.getPassword(), employee.getPassword())
        if (!loginRequest.getPassword().equals(employee.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(employee.getEmail());
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("employee", mapToEmployeeResponse(employee));
        response.put("role", employee.getRole().name());
        
        return response;
    }

    public Employee registerEmployee(Employee employee) {
        // Check if email already exists
        if (employeeRepository.findByEmail(employee.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + employee.getEmail());
        }

        // Check if employee ID already exists
        if (employeeRepository.findByEmployeeId(employee.getEmployeeId()).isPresent()) {
            throw new RuntimeException("Employee ID already exists: " + employee.getEmployeeId());
        }

        // Encode password
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        
        return employeeRepository.save(employee);
    }

    private Map<String, Object> mapToEmployeeResponse(Employee employee) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", employee.getId());
        response.put("employeeId", employee.getEmployeeId());
        response.put("firstName", employee.getFirstName());
        response.put("lastName", employee.getLastName());
        response.put("email", employee.getEmail());
        response.put("department", employee.getDepartment());
        response.put("position", employee.getPosition());
        response.put("role", employee.getRole().name());
        response.put("active", employee.isActive());
        return response;
    }

    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    public Optional<Employee> getEmployeeByEmployeeId(String employeeId) {
        return employeeRepository.findByEmployeeId(employeeId);
    }
}
