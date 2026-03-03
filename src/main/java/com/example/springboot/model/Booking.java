package com.example.springboot.model;

import java.time.LocalDateTime;

/**
 * Represents the core Booking entity.
 * Implements the Lifecycle requirements from Section 5.
 * act as the hub that connects a Client, a Consultant, and the Payment Status.
 */
public class Booking {
    private Long id;
    private Long clientId;
    private Consultant consultant;
    private LocalDateTime sessionTime;
    private double basePrice;
    
    // Lifecycle States: Requested, Confirmed, Pending Payment, Paid, Rejected, Cancelled, Completed
    private String state; 

    public Booking(Long id, Long clientId, Consultant consultant, LocalDateTime sessionTime, double basePrice) {
        this.id = id;
        this.clientId = clientId;
        this.consultant = consultant;
        this.sessionTime = sessionTime;
        this.basePrice = basePrice;
        this.state = "Requested"; // Initial state as per Section 5
    }

    // Getters and Setters
    public Long getId() { return id; }
    public Long getClientId() { return clientId; }
    public Consultant getConsultant() { return consultant; }
    public String getState() { return state; }
    
    /**
     * Updates the booking state. 
     * Requirement 5.1.2: Moves to 'Paid' after successful payment.
     */
    public void setState(String state) { 
        this.state = state; 
    }

    public double getBasePrice() { return basePrice; }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", state='" + state + '\'' +
                ", consultant=" + consultant.getName() +
                ", time=" + sessionTime +
                '}';
    }
}