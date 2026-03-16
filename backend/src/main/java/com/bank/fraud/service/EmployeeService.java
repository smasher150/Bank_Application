package com.bank.fraud.service;

import com.bank.fraud.model.Employee;
import com.bank.fraud.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    
    public Optional<Employee> getEmployeeById(@NonNull Long id) {
        return employeeRepository.findById(id);
    }
    
    public Optional<Employee> getEmployeeByEmployeeId(String employeeId) {
        return employeeRepository.findByEmployeeId(employeeId);
    }
    
    public Employee createEmployee(@NonNull Employee employee) {
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
}
