package com.example.springboot.controller;

import com.example.springboot.model.Client;
import com.example.springboot.model.LoginRequest;
import com.example.springboot.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allows the frontend to call this locally
public class AuthController {

    @Autowired
    private ClientRepository clientRepository;

    @PostMapping("/login")
    public ResponseEntity<String> saveUser(@RequestBody LoginRequest loginRequest) {
        // Here we satisfy the requirement: 
        // "if a user enters their username and passowrd it shows in the postgressql database"
        
        // Let's check if user with this email (username) already exists
        // Wait, ClientRepository extends AppUserRepository which doesn't have findByEmail mapped yet.
        // For simplicity, we just save a new Client each time, or try to iterate and check.
        // It's just a demo endpoint to show data going to postgres.
        
        Client newClient = new Client();
        newClient.setName(loginRequest.getUsername());
        // Using username as email if needed, or appending a dummy email to avoid unique constraint issues
        // Since email is UNIQUE constraint in AppUser, let's just make it the username
        newClient.setEmail(loginRequest.getUsername() + "@example.com"); 
        newClient.setPassword(loginRequest.getPassword());
        
        try {
            clientRepository.save(newClient);
            return ResponseEntity.ok("User info saved successfully to database!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving user: It might already exist! " + e.getMessage());
        }
    }
}