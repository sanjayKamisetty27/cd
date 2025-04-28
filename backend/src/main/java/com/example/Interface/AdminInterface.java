package com.example.Interface;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Model.Admin;

public interface AdminInterface extends JpaRepository<Admin, String> {
    
    // Method to find admin by username
    Admin findByUsername(String username);
}
