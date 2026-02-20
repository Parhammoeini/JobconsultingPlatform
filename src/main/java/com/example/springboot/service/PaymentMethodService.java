package com.example.springboot.service;

import com.example.springboot.model.PaymentRequest;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentMethodService {
    
    // Simulated secure storage in memory
    private final List<PaymentRequest> userSavedMethods = new ArrayList<>();

    // UC6: Add a new payment method
    public void addPaymentMethod(PaymentRequest method) {
        userSavedMethods.add(method);
    }

    // UC6: View all saved payment methods
    public List<PaymentRequest> getAllSavedMethods() {
        return userSavedMethods;
    }

    // UC6: Remove a payment method (Simplified logic using index or identifier)
    public boolean removePaymentMethod(int index) {
        if (index >= 0 && index < userSavedMethods.size()) {
            userSavedMethods.remove(index);
            return true;
        }
        return false;
    }

    // UC6: Update an existing method
    public void updatePaymentMethod(int index, PaymentRequest updatedMethod) {
        if (index >= 0 && index < userSavedMethods.size()) {
            userSavedMethods.set(index, updatedMethod);
        }
    }
}