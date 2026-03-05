package com.example.springboot.model;

/**
 * Section 5 – Booking Lifecycle States.
 *
 * Defines every legal state a Booking can be in, together with
 * a human-readable description for API responses.
 */
public enum BookingState {

    REQUESTED("Requested", "Initial state when a client submits a booking request"),
    CONFIRMED("Confirmed", "Consultant has accepted the booking request"),
    PENDING_PAYMENT("Pending Payment", "Booking confirmed but awaiting payment"),
    PAID("Paid", "Payment successfully processed"),
    REJECTED("Rejected", "Consultant has declined the booking request"),
    CANCELLED("Cancelled", "Client or consultant has cancelled the booking"),
    COMPLETED("Completed", "The consulting session has been completed");

    private final String label;
    private final String description;

    BookingState(String label, String description) {
        this.label = label;
        this.description = description;
    }

    public String getLabel() {
        return label;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Resolve a BookingState from its display label (e.g. "Pending Payment").
     * Falls back to name()-based lookup so both "REQUESTED" and "Requested" work.
     */
    public static BookingState fromLabel(String text) {
        if (text == null) {
            return null;
        }
        for (BookingState s : values()) {
            if (s.label.equalsIgnoreCase(text) || s.name().equalsIgnoreCase(text)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Unknown booking state: " + text);
    }
}
