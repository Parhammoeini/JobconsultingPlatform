package com.example.springboot.service;

import com.example.springboot.model.Consultant;
import com.example.springboot.model.PolicyManager;
import com.example.springboot.model.RegistrationStatus;
import com.example.springboot.model.SystemPolicy;
import com.example.springboot.repository.ConsultantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * AdminService - Refactored for JPA Persistence
 * Preserves all Phase 1 functionality while integrating with H2 Database.
 */
@Service
public class AdminService {

    @Autowired
    private ConsultantRepository consultantRepository;

    private final PolicyManager policyManager = PolicyManager.getInstance();

    // -----------------------------------------------------------------------
    // UC11 – Approve Consultant Registration (Database Driven)
    // -----------------------------------------------------------------------

    public Consultant registerConsultant(String name, String email, String specialization, String location, String bio, String education, String experiences) {
        // Prevent duplicate email violation by checking if the user already exists
        java.util.List<Consultant> existing = consultantRepository.findByEmail(email);
        if (!existing.isEmpty()) {
            return existing.get(0);
        }
        
        // ID is null because JPA GenerationType.IDENTITY will auto-assign it
        Consultant consultant = new Consultant(null, name, email, specialization, 0.0);
        consultant.setLocation(location);
        consultant.setBio(bio);
        consultant.setEducation(education);
        consultant.setExperiences(experiences);
        Consultant saved = consultantRepository.save(consultant);
        System.out.println("New consultant registered (PENDING): " + saved);
        return saved;
    }

    public Consultant approveConsultant(Long consultantId) {
        return updateStatus(consultantId, RegistrationStatus.APPROVED);
    }

    public Consultant rejectConsultant(Long consultantId) {
        return updateStatus(consultantId, RegistrationStatus.REJECTED);
    }

    private Consultant updateStatus(Long id, RegistrationStatus status) {
        return consultantRepository.findById(id).map(c -> {
            c.setStatus(status);
            Consultant updated = consultantRepository.save(c);
            System.out.println("Consultant " + status + ": " + updated);
            return updated;
        }).orElseGet(() -> {
            System.out.println("Consultant not found: " + id);
            return null;
        });
    }

    public List<Consultant> getAllConsultants() {
        return consultantRepository.findAll();
    }

    public List<Consultant> getPendingConsultants() {
        return consultantRepository.findAll().stream()
                .filter(c -> c.getStatus() == RegistrationStatus.PENDING)
                .collect(Collectors.toList());
    }

    public List<Consultant> getApprovedConsultants() {
        return consultantRepository.findAll().stream()
                .filter(c -> c.getStatus() == RegistrationStatus.APPROVED)
                .collect(Collectors.toList());
    }

    // -----------------------------------------------------------------------
    // UC12 – Define System Policies (Singleton Based)
    // -----------------------------------------------------------------------

    
    public SystemPolicy setPolicy(String name, String value, String description) {
        policyManager.addOrUpdatePolicy(name, value, description); 
        SystemPolicy updated = policyManager.getPolicy(name);
        System.out.println("Policy updated: " + updated);
        return updated;
    }

    public SystemPolicy getPolicy(String name) {
        return policyManager.getPolicy(name);
    }

    public Collection<SystemPolicy> getAllPolicies() {
        return policyManager.getAllPolicies();
    }

    public boolean removePolicy(String name) {
        return policyManager.removePolicy(name);
    }
}