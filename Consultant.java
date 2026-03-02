package com.example.springboot.model;

/**
 * Represents a Consultant on the platform.
 * Admins approve or reject consultants via UC11.
 */
public class Consultant {
    private Long id;
    private String name;
    private String email;
    private String specialization; // e.g. "Software Consulting", "Career Advising"
    private RegistrationStatus status; // PENDING, APPROVED, REJECTED

    public Consultant(Long id, String name, String email, String specialization) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.specialization = specialization;
        this.status = RegistrationStatus.PENDING; // all new consultants start as PENDING
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getSpecialization() { return specialization; }
    public RegistrationStatus getStatus() { return status; }

    public void setStatus(RegistrationStatus status) { this.status = status; }

    @Override
    public String toString() {
        return "Consultant{id=" + id + ", name='" + name + "', email='" + email +
               "', specialization='" + specialization + "', status=" + status + "}";
    }
}