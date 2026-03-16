package com.bank.fraud.security;

import com.bank.fraud.model.Employee;
import com.bank.fraud.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Employee not found with email: " + email));

        return User.builder()
                .username(employee.getEmail())
                .password(employee.getPassword() != null ? employee.getPassword() : "$2a$10$dummyHashedPasswordForDemo")
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + employee.getRole().name())))
                .accountExpired(false)
                .accountLocked(!employee.isActive())
                .credentialsExpired(false)
                .disabled(!employee.isActive())
                .build();
    }
}
