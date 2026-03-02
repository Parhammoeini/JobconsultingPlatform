package com.example.springboot.model;

/**
 * Represents the registration approval status of a Consultant.
 * Used by UC11 – Approve Consultant Registration.
 */
public enum RegistrationStatus {
    PENDING,   // Newly registered, awaiting admin review
    APPROVED,  // Admin has approved the consultant
    REJECTED   // Admin has rejected the consultant
}