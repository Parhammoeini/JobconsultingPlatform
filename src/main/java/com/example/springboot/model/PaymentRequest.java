package com.example.springboot.model;

public class PaymentRequest {
    // Basic Info
    private String type; // CREDIT_CARD, DEBIT_CARD, PAYPAL, BANK_TRANSFER

    // Card Details
    private String cardNumber;
    private String expiryDate;
    private String cvv;

    // PayPal Details
    private String email;

    // Bank Details
    private String accountNumber;
    private String routingNumber;

    // Default Constructor
    public PaymentRequest() {}

    // GETTERS AND SETTERS
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getCvv() { return cvv; }
    public void setCvv(String cvv) { this.cvv = cvv; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getRoutingNumber() { return routingNumber; }
    public void setRoutingNumber(String routingNumber) { this.routingNumber = routingNumber; }
}