package com.example.springboot.controller;

import com.example.springboot.model.AppUser;
import com.example.springboot.model.Client;
import com.example.springboot.model.Consultant;
import com.example.springboot.model.LoginRequest;
import com.example.springboot.model.RegistrationStatus;
import com.example.springboot.repository.AppUserRepository;
import com.example.springboot.repository.ClientRepository;
import com.example.springboot.repository.ConsultantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private ConsultantRepository consultantRepository;

    
    @PostMapping("/login")
    public ResponseEntity<?> saveUser(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        java.util.List<AppUser> users = appUserRepository.findByName(username);
        AppUser user = users.isEmpty() ? null : users.get(0);

        if (user == null) {
            // Create a new Client account with a unique username
            Client newClient = new Client();
            newClient.setName(username);
            // Use a derived email to avoid collisions with consultant applications
            newClient.setEmail(username + "@example.com");
            newClient.setPassword(password);
            user = clientRepository.save(newClient);
        } else if (user.getPassword() != null && !user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", "Invalid username or password"));
        } else if (user.getPassword() == null) {
            user.setPassword(password);
            appUserRepository.save(user);
        }

        // Resolve consultant status by username or email
        java.util.List<Consultant> consultants = consultantRepository.findByName(username);
        if (consultants.isEmpty()) {
            consultants = consultantRepository.findByEmail(username);
        }
        Consultant consultant = consultants.isEmpty() ? null : consultants.get(0);

        if (consultant != null && consultant.getStatus() == RegistrationStatus.APPROVED) {
            return ResponseEntity.ok(java.util.Map.of(
                    "role", "CONSULTANT",
                    "status", "APPROVED",
                    "userId", user.getId(),
                    "username", username
            ));
        }

        String consultantStatus = consultant == null ? "NONE" : consultant.getStatus().name();

        return ResponseEntity.ok(java.util.Map.of(
                "role", "CLIENT",
                "status", consultantStatus,
                "userId", user.getId(),
                "username", username
        ));
    }
}