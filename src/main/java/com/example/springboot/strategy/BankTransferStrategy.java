package com.example.springboot.strategy;

import com.example.springboot.model.PaymentRequest;
import org.springframework.stereotype.Component;

@Component("bankTransferStrategy")
public class BankTransferStrategy implements PaymentStrategy {

    @Override
    public boolean validate(PaymentRequest request) {
        System.out.println("Validating Bank Transfer Details...");
        
        // Requirement 5.1.1: Validate account number and routing number formats
        boolean hasAccount = request.getAccountNumber() != null && request.getAccountNumber().length() >= 8;
        boolean hasRouting = request.getRoutingNumber() != null && request.getRoutingNumber().length() == 9;

        if (!hasAccount || !hasRouting) {
            System.out.println("Validation Failed: Invalid Account or Routing Number.");
            return false;
        }
        return true;
    }

    @Override
    public String process(double amount) {
        // Simulated processing
        System.out.println("Processing Bank Transfer for: $" + amount);
        return "SUCCESS";
    }
}