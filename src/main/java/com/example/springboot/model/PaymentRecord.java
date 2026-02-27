package com.example.springboot.model;

public class PaymentRecord {
    private Long clientId;
    private String transactionId;
    private double amount;
    private String status;

    public PaymentRecord(Long clientId, String transactionId, double amount, String status) {
        this.clientId = clientId;
        this.transactionId = transactionId;
        this.amount = amount;
        this.status = status;
    }

    public Long getClientId() { return clientId; }
    public String getTransactionId() { return transactionId; }
    public double getAmount() { return amount; }
    public String getStatus() { return status; }
}