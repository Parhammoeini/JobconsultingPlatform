package com.example.springboot.strategy;

import com.example.springboot.model.PaymentRequest;
import org.springframework.stereotype.Component;

@Component("bankTransferStrategy")
public class BankTransferStrategy implements PaymentStrategy {

    @Override
    public String getMethodName() {
        return "BANK_TRANSFER"; // This "links" the class to the String used in the test
    }

    @Override
    public boolean validate(PaymentRequest request) {
        System.out.println("Validating Bank Transfer Details...");
        
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
        System.out.println("Processing Bank Transfer for: $" + amount);
        return "SUCCESS";
    }
}