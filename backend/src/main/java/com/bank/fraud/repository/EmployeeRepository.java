package com.bank.fraud.repository;

import com.bank.fraud.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmployeeId(String employeeId);
    
    Optional<Employee> findByEmail(String email);
    
    List<Employee> findByDepartment(String department);
    
    List<Employee> findByActive(boolean active);
    
    @Query("SELECT e FROM Employee e WHERE e.role = :role")
    List<Employee> findByRole(@Param("role") Employee.Role role);
    
    @Query("SELECT e FROM Employee e WHERE e.department = :department AND e.active = true")
    List<Employee> findActiveByDepartment(@Param("department") String department);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.active = true")
    long countActiveEmployees();
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department = :department AND e.active = true")
    long countActiveByDepartment(@Param("department") String department);
}
