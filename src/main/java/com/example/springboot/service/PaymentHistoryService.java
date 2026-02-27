package com.example.springboot.service;

import com.example.springboot.observer.PaymentObserver;
import com.example.springboot.model.PaymentRecord;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class PaymentHistoryService implements PaymentObserver {
    private final List<PaymentRecord> history = new ArrayList<>();

    @Override
    public void onPaymentSuccess(Long clientId, String txnId, double amount) {
        // UC7: Automatically record the successful payment
        history.add(new PaymentRecord(clientId, txnId, amount, "SUCCESS"));
        System.out.println("History Updated: Transaction " + txnId + " recorded.");
    }

    public List<PaymentRecord> getHistoryByClient(Long clientId) {
        // Logic to filter history for the specific client
        return history;
    }
}