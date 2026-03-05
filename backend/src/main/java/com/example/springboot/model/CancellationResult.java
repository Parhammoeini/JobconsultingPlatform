package com.example.springboot.model;

/**
 * DTO returned after a cancellation attempt (UC3).
 */
public class CancellationResult {

    private Long bookingId;
    private boolean success;
    private String previousState;
    private String newState;
    private String message;
    private double refundPercentage;

    public CancellationResult() {}

    public CancellationResult(Long bookingId, boolean success, String previousState,
                              String newState, String message, double refundPercentage) {
        this.bookingId = bookingId;
        this.success = success;
        this.previousState = previousState;
        this.newState = newState;
        this.message = message;
        this.refundPercentage = refundPercentage;
    }

    public Long getBookingId() { return bookingId; }
    public boolean isSuccess() { return success; }
    public String getPreviousState() { return previousState; }
    public String getNewState() { return newState; }
    public String getMessage() { return message; }
    public double getRefundPercentage() { return refundPercentage; }

    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public void setSuccess(boolean success) { this.success = success; }
    public void setPreviousState(String previousState) { this.previousState = previousState; }
    public void setNewState(String newState) { this.newState = newState; }
    public void setMessage(String message) { this.message = message; }
    public void setRefundPercentage(double refundPercentage) { this.refundPercentage = refundPercentage; }
}
