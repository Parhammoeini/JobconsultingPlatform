package com.example.springboot.observer;

public interface PaymentObserver {
    void onPaymentSuccess(Long clientId, String txnId, double amount);
}