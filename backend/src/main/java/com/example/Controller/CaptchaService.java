package com.example.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/captcha")
@CrossOrigin(origins = "http://localhost:3001")  // Allowing frontend to access the API
public class CaptchaService {

    @GetMapping("/generate")
    public ResponseEntity<Map<String, String>> generateCaptcha() {
        Map<String, String> response = new HashMap<>();
        String captcha = generateRandomCaptcha();
        response.put("captcha", captcha);  // Returning the captcha in the response
        System.out.println("Generated Captcha: " + captcha);  // Log captcha for debugging
        return ResponseEntity.ok(response);
    }

    // Helper method to generate a random captcha
    private String generateRandomCaptcha() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder captcha = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) { // Generate a 6-character captcha
            captcha.append(chars.charAt(random.nextInt(chars.length())));
        }
        return captcha.toString();
    }
}