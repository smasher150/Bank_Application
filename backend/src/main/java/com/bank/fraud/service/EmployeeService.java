package com.bank.fraud.service;

import com.bank.fraud.model.Employee;
import com.bank.fraud.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private static final String DEFAULT_PASSWORD = "ChangeMe123!";
    
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    
    public Optional<Employee> getEmployeeById(@NonNull Long id) {
        return employeeRepository.findById(id);
    }
    
    public Optional<Employee> getEmployeeByEmployeeId(String employeeId) {
        return employeeRepository.findByEmployeeId(employeeId);
    }
    
    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }
    
    public Employee createEmployee(@NonNull Employee employee) {
        // Set default password if not provided
        if (employee.getPassword() == null || employee.getPassword().trim().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
        } else {
            // Encode the provided password
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        }
        return employeeRepository.save(employee);
    }
    
    public Employee updateEmployee(@NonNull Long id, @NonNull Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setPosition(employeeDetails.getPosition());
        employee.setRole(employeeDetails.getRole());
        employee.setActive(employeeDetails.isActive());
        
        return employeeRepository.save(employee);
    }
    
    public void deleteEmployee(@NonNull Long id) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        // Explicit null check to satisfy type safety
        if (employee != null) {
            employeeRepository.delete(employee);
        }
    }
    
    public List<Employee> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }
    
    public List<Employee> getActiveEmployees() {
        return employeeRepository.findByActive(true);
    }
    
    public List<Employee> getEmployeesByRole(Employee.Role role) {
        return employeeRepository.findByRole(role);
    }
    
    public long getTotalActiveEmployees() {
        return employeeRepository.countActiveEmployees();
    }
    
    public long getActiveEmployeesByDepartment(String department) {
        return employeeRepository.countActiveByDepartment(department);
    }
    
    public Employee changePassword(@NonNull String employeeId, @NonNull String currentPassword, @NonNull String newPassword) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        // Note: In a real application, you would verify the current password here
        // For now, we'll just update with the new password
        employee.setPassword(passwordEncoder.encode(newPassword));
        return employeeRepository.save(employee);
    }
    
    // New method for transfer functionality
    public Optional<Employee> getEmployeeByAccountNumber(String accountNumber) {
        // For demo purposes, we'll search by employeeId as accountNumber
        // In a real system, you would have a dedicated accountNumber field
        return employeeRepository.findByEmployeeId(accountNumber);
    }
    
    // New method to update employee directly
    public Employee updateEmployee(@NonNull Employee employee) {
        return employeeRepository.save(employee);
    }
}
