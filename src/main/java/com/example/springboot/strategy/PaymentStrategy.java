package com.example.springboot.strategy;

import com.example.springboot.model.PaymentRequest; 
import org.springframework.stereotype.Component;   

@Component("payPalStrategy") // Explicit bean name matches your bean list
public class PayPalStrategy implements PaymentStrategy {

    @Override
    public boolean validate(PaymentRequest request) {
        // Requirement 5.1.1: Validate email format
        System.out.println("Validating PayPal email...");
        return request.getEmail() != null && 
               request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }

    @Override
    public String process(double amount) {
        System.out.println("Processing PayPal payment for $" + amount);
        return "SUCCESS"; 
    }
}