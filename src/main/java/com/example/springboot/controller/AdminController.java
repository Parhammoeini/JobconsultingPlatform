package com.example.springboot.controller;

import com.example.springboot.model.Consultant;
import com.example.springboot.model.SystemPolicy;
import com.example.springboot.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * AdminController
 *
 * REST API endpoints for admin use cases:
 *   UC11 – Approve Consultant Registration
 *   UC12 – Define System Policies
 *
 * Base URL: /api/admin
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // -----------------------------------------------------------------------
    // UC11 – Consultant Registration Management
    // -----------------------------------------------------------------------

    /**
     * Register a new consultant (simulates a consultant signing up).
     * POST /api/admin/consultants/register
     *
     * Request body example:
     * {
     *   "name": "Alice Smith",
     *   "email": "alice@example.com",
     *   "specialization": "Software Consulting"
     * }
     */
    @PostMapping("/consultants/register")
    public ResponseEntity<Consultant> registerConsultant(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String specialization = body.get("specialization");
        Consultant consultant = adminService.registerConsultant(name, email, specialization);
        return ResponseEntity.ok(consultant);
    }

    /**
     * Get all consultants.
     * GET /api/admin/consultants
     */
    @GetMapping("/consultants")
    public ResponseEntity<List<Consultant>> getAllConsultants() {
        return ResponseEntity.ok(adminService.getAllConsultants());
    }

    /**
     * Get only consultants pending approval.
     * GET /api/admin/consultants/pending
     */
    @GetMapping("/consultants/pending")
    public ResponseEntity<List<Consultant>> getPendingConsultants() {
        return ResponseEntity.ok(adminService.getPendingConsultants());
    }

    /**
     * Get only approved consultants.
     * GET /api/admin/consultants/approved
     */
    @GetMapping("/consultants/approved")
    public ResponseEntity<List<Consultant>> getApprovedConsultants() {
        return ResponseEntity.ok(adminService.getApprovedConsultants());
    }

    /**
     * Approve a consultant registration.
     * PUT /api/admin/consultants/{id}/approve
     */
    @PutMapping("/consultants/{id}/approve")
    public ResponseEntity<?> approveConsultant(@PathVariable Long id) {
        Consultant consultant = adminService.approveConsultant(id);
        if (consultant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(consultant);
    }

    /**
     * Reject a consultant registration.
     * PUT /api/admin/consultants/{id}/reject
     */
    @PutMapping("/consultants/{id}/reject")
    public ResponseEntity<?> rejectConsultant(@PathVariable Long id) {
        Consultant consultant = adminService.rejectConsultant(id);
        if (consultant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(consultant);
    }

    // -----------------------------------------------------------------------
    // UC12 – System Policy Management
    // -----------------------------------------------------------------------

    /**
     * Get all system policies.
     * GET /api/admin/policies
     */
    @GetMapping("/policies")
    public ResponseEntity<Collection<SystemPolicy>> getAllPolicies() {
        return ResponseEntity.ok(adminService.getAllPolicies());
    }

    /**
     * Get a specific policy by name.
     * GET /api/admin/policies/{name}
     */
    @GetMapping("/policies/{name}")
    public ResponseEntity<?> getPolicy(@PathVariable String name) {
        SystemPolicy policy = adminService.getPolicy(name);
        if (policy == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(policy);
    }

    /**
     * Create or update a system policy.
     * POST /api/admin/policies
     *
     * Request body example:
     * {
     *   "policyName": "cancellationWindowHours",
     *   "policyValue": "48",
     *   "description": "Hours before session within which cancellation is allowed"
     * }
     */
    @PostMapping("/policies")
    public ResponseEntity<SystemPolicy> setPolicy(@RequestBody Map<String, String> body) {
        String name = body.get("policyName");
        String value = body.get("policyValue");
        String description = body.get("description");
        SystemPolicy policy = adminService.setPolicy(name, value, description);
        return ResponseEntity.ok(policy);
    }

    /**
     * Delete a policy by name.
     * DELETE /api/admin/policies/{name}
     */
    @DeleteMapping("/policies/{name}")
    public ResponseEntity<?> removePolicy(@PathVariable String name) {
        boolean removed = adminService.removePolicy(name);
        if (!removed) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Policy '" + name + "' removed.");
    }
}
