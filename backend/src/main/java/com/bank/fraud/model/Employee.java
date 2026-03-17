package com.bank.fraud.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String employeeId;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String department;
    
    @Column(nullable = false)
    private String position;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    @Column(nullable = false)
    private boolean active = true;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "individual_risk_amount", precision = 19, scale = 2)
    private BigDecimal individualRiskAmount = BigDecimal.ZERO;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<Transaction> transactions;
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<FraudAlert> fraudAlerts;
    
    public enum Role {
        ADMIN, MANAGER, AUDITOR, TELLER, ANALYST
    }
    
    // Constructors
    public Employee() {}
    
    public Employee(String employeeId, String firstName, String lastName, String email, 
                   String department, String position, Role role) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
        this.position = position;
        this.role = role;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public BigDecimal getIndividualRiskAmount() { return individualRiskAmount; }
    public void setIndividualRiskAmount(BigDecimal individualRiskAmount) { this.individualRiskAmount = individualRiskAmount; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }
    
    public List<FraudAlert> getFraudAlerts() { return fraudAlerts; }
    public void setFraudAlerts(List<FraudAlert> fraudAlerts) { this.fraudAlerts = fraudAlerts; }
}
