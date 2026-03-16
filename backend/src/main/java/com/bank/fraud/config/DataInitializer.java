package com.bank.fraud.config;

import com.bank.fraud.model.Employee;
import com.bank.fraud.model.Employee.Role;
import com.bank.fraud.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (!employeeRepository.findByEmail("admin@bank.com").isPresent()) {
            // Create admin user
            Employee admin = new Employee();
            admin.setEmployeeId("ADMIN001");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@bank.com");
            admin.setDepartment("IT");
            admin.setPosition("System Administrator");
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            admin.setPassword(passwordEncoder.encode("admin123"));
            
            employeeRepository.save(admin);
            System.out.println("Admin user created successfully!");
        }
        
        // Create sample employees for demonstration
        if (employeeRepository.count() <= 1) {
            createSampleEmployees();
        }
    }
    
    private void createSampleEmployees() {
        Employee employee1 = new Employee();
        employee1.setEmployeeId("EMP001");
        employee1.setFirstName("John");
        employee1.setLastName("Smith");
        employee1.setEmail("john.smith@bank.com");
        employee1.setDepartment("Retail Banking");
        employee1.setPosition("Teller");
        employee1.setRole(Role.TELLER);
        employee1.setActive(true);
        employee1.setPassword(passwordEncoder.encode("password123"));
        
        Employee employee2 = new Employee();
        employee2.setEmployeeId("EMP002");
        employee2.setFirstName("Sarah");
        employee2.setLastName("Johnson");
        employee2.setEmail("sarah.johnson@bank.com");
        employee2.setDepartment("Commercial Banking");
        employee2.setPosition("Relationship Manager");
        employee2.setRole(Role.MANAGER);
        employee2.setActive(true);
        employee2.setPassword(passwordEncoder.encode("password123"));
        
        Employee employee3 = new Employee();
        employee3.setEmployeeId("EMP003");
        employee3.setFirstName("Michael");
        employee3.setLastName("Brown");
        employee3.setEmail("michael.brown@bank.com");
        employee3.setDepartment("Audit");
        employee3.setPosition("Internal Auditor");
        employee3.setRole(Role.AUDITOR);
        employee3.setActive(true);
        employee3.setPassword(passwordEncoder.encode("password123"));
        
        employeeRepository.save(employee1);
        employeeRepository.save(employee2);
        employeeRepository.save(employee3);
        
        System.out.println("Sample employees created successfully!");
    }
}
