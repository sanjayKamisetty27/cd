package com.example.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Interface.AdminInterface;
import com.example.Model.Admin;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AdminService {

    @Autowired
    AdminInterface adminInterface;

    // Login endpoint
    @PostMapping("/admin/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Admin admin, HttpSession session) {
        Map<String, String> response = new HashMap<>();

        // Check if the username exists
        Admin existingAdmin = adminInterface.findByUsername(admin.getUsername());
        if (existingAdmin == null) {
            response.put("message", "Username not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        // Check if the password matches
        if (!existingAdmin.getPassword().equals(admin.getPassword())) {
            response.put("message", "Invalid password");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        // Set session attribute
        session.setAttribute("loggedInAdmin", existingAdmin.getUsername());
        response.put("message", "Login successful");
        response.put("authToken", "someGeneratedTokenForSession"); // Dummy token for simplicity
        return ResponseEntity.ok(response);
    }

    // Endpoint to fetch admin data using username from session
    @GetMapping("/admin")
    public ResponseEntity<Map<String, String>> getAdminDetails(@RequestParam String username, HttpSession session) {
        Map<String, String> response = new HashMap<>();

        // Check session
        String loggedInAdmin = (String) session.getAttribute("loggedInAdmin");
        if (loggedInAdmin == null || !loggedInAdmin.equals(username)) {
            response.put("message", "Unauthorized access");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        // Fetch admin details
        Admin admin = adminInterface.findByUsername(username);
        if (admin == null) {
            response.put("message", "Admin not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        response.put("username", admin.getUsername());
//      response.put("name", admin.getName()); 
        return ResponseEntity.ok(response);
    }

}
