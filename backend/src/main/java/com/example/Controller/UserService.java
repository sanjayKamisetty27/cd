package com.example.Controller;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.example.Interface.UserInterface;
import com.example.Model.User;
import com.example.Interface.DAO;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserService {

    @Autowired
    DAO dao;
    
    @Autowired
    UserInterface userInterface;
  
    @PostMapping("/users")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        try {
            // Validate mandatory fields
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                response.put("message", "Email is required");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST); // 400 Bad Request
            }

            if (user.getName() == null || user.getName().isEmpty()) {
                response.put("message", "Name is required");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST); // 400 Bad Request
            }

            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                response.put("message", "Password is required");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST); // 400 Bad Request
            }

            // Check if email already exists
            if (userInterface.findByEmail(user.getEmail()) != null) {
                response.put("message", "Email already exists");
                return new ResponseEntity<>(response, HttpStatus.CONFLICT); // 409 Conflict
            }

            // Insert the user
            dao.insert(user);
            response.put("message", "User registered successfully");
            return new ResponseEntity<>(response, HttpStatus.CREATED); // 201 Created

        } catch (Exception e) {
            response.put("message", "An error occurred while registering the user");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    // Login
    @PostMapping("/users/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        // Check if the email exists
        User existingUser = userInterface.findByEmail(user.getEmail());
        if (existingUser == null) {
            response.put("message", "Email not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND); // 404 Not Found
        }

        // Check if the password matches
        if (!existingUser.getPassword().equals(user.getPassword())) {
            response.put("message", "Invalid password");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED); // 401 Unauthorized
        }

        // If email and password match, create session or JWT
        response.put("message", "Login successful");
        response.put("userId", existingUser.getEmail()); // Can send the email or a JWT token
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = userInterface.findByEmail(email) != null;
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    // Get User Info (Fetch user details by email)
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUser(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        
        // Retrieve user from the database based on email
        User existingUser = userInterface.findByEmail(email);
        if (existingUser == null) {
            response.put("message", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND); // 404 Not Found
        }

        // Return user details
        response.put("message", "User found");
        response.put("user", existingUser); // Return the full user object or specific fields
        return ResponseEntity.ok(response);
    }
    
    //Get users
    @GetMapping("/users/all")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userInterface.findAll(pageable); // Assuming `userInterface` extends `JpaRepository`
        return ResponseEntity.ok(usersPage);
    }
    
    //edit user
    @PutMapping("/edit/{email}")
    public CompletableFuture<ResponseEntity<?>> editUser(
            @PathVariable String email,
            @RequestParam("name") String name,
            @RequestParam("gender") String gender,
            @RequestParam("birthDate") String birthDate,
            @RequestParam("heightFeet") String heightFeet,
            @RequestParam("heightInches") String heightInches,
            @RequestParam("weight") String weight,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("address") String address,
            @RequestParam("bio") String bio,
            @RequestParam(value = "currentPassword", required = false) String currentPassword, // Made optional
            @RequestParam(value = "newPassword", required = false) String newPassword,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {

        return CompletableFuture.supplyAsync(() -> {
            try {
                // Retrieve the user by email
                User existingUser = userInterface.findByEmail(email);
                if (existingUser == null) {
                    return ResponseEntity.status(404).body("User not found");
                }

                // If currentPassword is provided, check if it matches the stored password
                if (currentPassword != null && !currentPassword.equals(existingUser.getPassword())) {
                    return ResponseEntity.status(400).body("Incorrect current password");
                }

                // Update user fields
                existingUser.setName(name);
                existingUser.setGender(gender);
                existingUser.setBirthDate(birthDate);
                existingUser.setHeightFeet(heightFeet);
                existingUser.setHeightInches(heightInches);
                existingUser.setWeight(weight);
                existingUser.setPhoneNumber(phoneNumber);
                existingUser.setAddress(address);
                existingUser.setBio(bio);

                // Update password if a new password is provided
                if (newPassword != null && !newPassword.trim().isEmpty()) {
                    existingUser.setPassword(newPassword);  // Set the new password
                }

                // Update profile image if provided
                if (profileImage != null && !profileImage.isEmpty()) {
                    byte[] imageBytes = profileImage.getBytes();
                    existingUser.setProfileImage(imageBytes);
                }

                // Save the updated user
                User savedUser = userInterface.save(existingUser);
                return ResponseEntity.ok(savedUser);

            } catch (IOException e) {
                return ResponseEntity.status(500).body("Error processing profile image: " + e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error updating user: " + e.getMessage());
            }
        });
    }
    
    @PostMapping("/verify-password")
    public ResponseEntity<?> verifyPassword(@RequestBody User request) {
        User existingUser = userInterface.findByEmail(request.getEmail());
        if (existingUser == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        if (!existingUser.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(400).body("Incorrect password");
        }
        return ResponseEntity.ok("Password is correct");
    }




    @PutMapping("/adminedit/{email}")
    public ResponseEntity<User> editUser(@PathVariable String email, @RequestBody User updatedUser) {
        // Retrieve the user by email
        User existingUser = userInterface.findByEmail(email);
        if (existingUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }

        // Update fields
        existingUser.setName(updatedUser.getName());
        existingUser.setGender(updatedUser.getGender());
        existingUser.setBirthDate(updatedUser.getBirthDate());
        existingUser.setHeightFeet(updatedUser.getHeightFeet());
        existingUser.setHeightInches(updatedUser.getHeightInches());
        existingUser.setWeight(updatedUser.getWeight());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber()); // Optional phone number
        existingUser.setAddress(updatedUser.getAddress()); // Optional address
        existingUser.setBio(updatedUser.getBio()); // Optional bio
        if (updatedUser.getProfileImage() != null) {
            existingUser.setProfileImage(updatedUser.getProfileImage()); // Update profile image if provided
        }

        // Save the updated user
        User savedUser = userInterface.save(existingUser);
        return ResponseEntity.ok(savedUser);
    }


    // Delete a user
    @DeleteMapping("/delete/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) {
        // Retrieve the user by email
        User existingUser = userInterface.findByEmail(email);
        if (existingUser == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND); // 404 Not Found
        }

        // Delete the user
        userInterface.delete(existingUser);
        return ResponseEntity.ok("User deleted successfully.");
    }
    
    @GetMapping("/imageconverter/{email}")
    public CompletableFuture<ResponseEntity<Map<String, String>>> convertImageToBase64(@PathVariable String email) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                User existingUser = userInterface.findByEmail(email);
                if (existingUser == null || existingUser.getProfileImage() == null) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("message", "Image not found");
                    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND); // 404 Not Found
                }

                // Detect image content type
                byte[] imageBytes = existingUser.getProfileImage();
                String contentType = "image/jpeg";

                if (imageBytes.length > 1) {
                    if (imageBytes[0] == (byte) 0x89 && imageBytes[1] == (byte) 0x50) {
                        contentType = "image/png";
                    } else if (imageBytes[0] == (byte) 0xFF && imageBytes[1] == (byte) 0xD8) {
                        contentType = "image/jpeg";
                    }
                }

                // Convert byte array to Base64 string
                String base64Image = "data:" + contentType + ";base64," + Base64.getEncoder().encodeToString(imageBytes);
                Map<String, String> response = new HashMap<>();
                response.put("image", base64Image);
                return ResponseEntity.ok(response);

            } catch (Exception e) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Error retrieving image: " + e.getMessage());
                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
            }
        });
    }

}




