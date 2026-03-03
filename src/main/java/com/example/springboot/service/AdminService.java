package com.example.springboot.service;

import com.example.springboot.model.Consultant;
import com.example.springboot.model.PolicyManager;
import com.example.springboot.model.RegistrationStatus;
import com.example.springboot.model.SystemPolicy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AdminService
 *
 * Contains all business logic for admin use cases:
 *   UC11 – Approve Consultant Registration
 *   UC12 – Define System Policies
 *
 * In-memory storage is used for Phase 1 (no database required).
 */
@Service
public class AdminService {

    // In-memory store for consultants (maps ID -> Consultant)
    private final Map<Long, Consultant> consultantStore = new HashMap<>();
    private long nextConsultantId = 1;

    // Reference to the singleton PolicyManager
    private final PolicyManager policyManager = PolicyManager.getInstance();

    // -----------------------------------------------------------------------
    // UC11 – Approve Consultant Registration
    // -----------------------------------------------------------------------

    /**
     * Register a new consultant (starts in PENDING state).
     * In a real system this would be called when a consultant signs up.
     */
    public Consultant registerConsultant(String name, String email, String specialization) {
        Consultant consultant = new Consultant(nextConsultantId++, name, email, specialization);
        consultantStore.put(consultant.getId(), consultant);
        System.out.println("New consultant registered (PENDING): " + consultant);
        return consultant;
    }

    /**
     * Admin approves a consultant registration.
     * Returns the updated consultant, or null if not found.
     */
    public Consultant approveConsultant(Long consultantId) {
        Consultant consultant = consultantStore.get(consultantId);
        if (consultant == null) {
            System.out.println("Consultant not found: " + consultantId);
            return null;
        }
        consultant.setStatus(RegistrationStatus.APPROVED);
        System.out.println("Consultant APPROVED: " + consultant);
        return consultant;
    }

    /**
     * Admin rejects a consultant registration.
     * Returns the updated consultant, or null if not found.
     */
    public Consultant rejectConsultant(Long consultantId) {
        Consultant consultant = consultantStore.get(consultantId);
        if (consultant == null) {
            System.out.println("Consultant not found: " + consultantId);
            return null;
        }
        consultant.setStatus(RegistrationStatus.REJECTED);
        System.out.println("Consultant REJECTED: " + consultant);
        return consultant;
    }

    /**
     * Get all consultants (useful for admin dashboard).
     */
    public List<Consultant> getAllConsultants() {
        return new ArrayList<>(consultantStore.values());
    }

    /**
     * Get only consultants awaiting approval.
     */
    public List<Consultant> getPendingConsultants() {
        List<Consultant> pending = new ArrayList<>();
        for (Consultant c : consultantStore.values()) {
            if (c.getStatus() == RegistrationStatus.PENDING) {
                pending.add(c);
            }
        }
        return pending;
    }

    /**
     * Get only approved consultants (e.g. to show clients in UC1).
     */
    public List<Consultant> getApprovedConsultants() {
        List<Consultant> approved = new ArrayList<>();
        for (Consultant c : consultantStore.values()) {
            if (c.getStatus() == RegistrationStatus.APPROVED) {
                approved.add(c);
            }
        }
        return approved;
    }

    // -----------------------------------------------------------------------
    // UC12 – Define System Policies
    // -----------------------------------------------------------------------

    /**
     * Admin sets or updates a system policy.
     */
    public SystemPolicy setPolicy(String name, String value, String description) {
        policyManager.addOrUpdatePolicy(name, value, description);
        SystemPolicy updated = policyManager.getPolicy(name);
        System.out.println("Policy updated: " + updated);
        return updated;
    }

    /**
     * Get a specific policy by name.
     */
    public SystemPolicy getPolicy(String name) {
        return policyManager.getPolicy(name);
    }

    /**
     * Get all current system policies.
     */
    public Collection<SystemPolicy> getAllPolicies() {
        return policyManager.getAllPolicies();
    }

    /**
     * Remove a policy by name.
     */
    public boolean removePolicy(String name) {
        return policyManager.removePolicy(name);
    }
}
