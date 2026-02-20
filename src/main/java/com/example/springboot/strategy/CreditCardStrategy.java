package com.example.springboot.strategy;

import com.example.springboot.model.PaymentRequest;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class CreditCardStrategy implements PaymentStrategy {
    @Override
    public boolean validate(PaymentRequest req) {
        // Req 5.1.1: 16 digits, future date (dummy check), CVV 3-4 digits
        return req.getCardNumber().matches("\\d{16}") && req.getCvv().matches("\\d{3,4}");
    }

    @Override
    public String process(double amount) {
        try { Thread.sleep(2500); } catch (InterruptedException e) {} // 2-3s delay
        return "CC-" + UUID.randomUUID().toString(); 
    }

    @Override
    public String getMethodName() { return "CREDIT_CARD"; }
}