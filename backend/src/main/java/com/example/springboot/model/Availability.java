package com.example.springboot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Changed from UUID to IDENTITY to match Long type
    private Long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean booked;

    @Enumerated(EnumType.STRING) // Added to store "AVAILABLE" instead of 0
    private AvailabilityStatus status;

    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private Consultant consultant;

    // MANDATORY: Default Constructor for JPA
    public Availability() {}

    // GETTERS (JPA needs these to retrieve the ID)
    public Long getId() { return id; }
    public AvailabilityStatus getStatus() { return status; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }

    public void setConsultant(Consultant consultant){
        this.consultant = consultant;
    }

    public void setStatus(AvailabilityStatus availabilityStatus) {
        // Business Logic Guardrails
        if (this.status == AvailabilityStatus.BOOKED && availabilityStatus == AvailabilityStatus.AVAILABLE) {
            throw new IllegalStateException("Cannot revert a booked slot to available");
        }
        if(this.status == AvailabilityStatus.CANCELLED && availabilityStatus == AvailabilityStatus.BOOKED){
            throw new IllegalStateException("Cannot book a cancelled slot");
        }
        this.status = availabilityStatus;
    }

    public void setStartTime(LocalDateTime startTime) {
        if (this.endTime != null && startTime.isAfter(this.endTime)) {
            throw new IllegalArgumentException("Start time cannot be after end time");
        }
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        if (this.startTime != null && endTime.isBefore(this.startTime)) {
            throw new IllegalArgumentException("End time cannot be before start time");
        }
        this.endTime = endTime;
    }
}