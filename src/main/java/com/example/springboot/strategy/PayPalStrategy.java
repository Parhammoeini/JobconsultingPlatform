package com.example.springboot.strategy;

import com.example.springboot.model.PaymentRequest; 
import org.springframework.stereotype.Component;   
import java.util.UUID;                            

@Component
public class PayPalStrategy implements PaymentStrategy {

    @Override
    public String getMethodName() {
        return "PAYPAL";
    }

    @Override
    public boolean validate(PaymentRequest request) {
        // Simple email regex/check
        return request.getEmail() != null && request.getEmail().contains("@");
    }

    @Override
    public String process(double amount) {
        try {
            Thread.sleep(2000); // Req 5.1.2 simulation
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return UUID.randomUUID().toString();
    }
}