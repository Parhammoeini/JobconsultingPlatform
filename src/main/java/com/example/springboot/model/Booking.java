package com.example.springboot.model;

import com.example.springboot.observer.BookingObserver;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
    private List<BookingObserver> observers = new ArrayList<>();

    // Observer methods
    public void addObserver(BookingObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(BookingObserver observer) {
        observers.remove(observer);
    }

    private void notifyObservers() {
        for (BookingObserver observer : observers) {
            observer.update(this);
        }
    }
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

    public void confirm() {
        if (!Objects.equals(this.state, "Requested")) {
            throw new IllegalStateException("Booking already processed: " + this.state );
        }
        this.state = "Confirmed";
        notifyObservers();
    }

    public void reject() {
        if (!Objects.equals(this.state, "Requested")) {
            throw new IllegalStateException("Booking already processed: " + this.state );
        }
        this.state = "Rejected";
        notifyObservers();
    }

    public void cancel() {

        if (Objects.equals(this.state, "Completed")) {
            throw new IllegalStateException("Completed booking cannot be cancelled");
        }

        this.state = "Cancelled";
    }

    public void complete() {

        if (!Objects.equals(this.state, "Paid")) {
            throw new IllegalStateException("Booking must be paid before completion");
        }

        this.state = "Completed";
    }
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