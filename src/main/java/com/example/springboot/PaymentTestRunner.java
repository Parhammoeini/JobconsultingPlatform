package com.example.springboot.runner;

import com.example.springboot.model.*;
import com.example.springboot.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class PaymentTestRunner implements CommandLineRunner {

    private final PaymentService paymentService;

    public PaymentTestRunner(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n--- STARTING SYSTEM INTEGRATION TEST ---");

        // 1. Simulate a Consultant (Teammate's Code)
        Consultant consultant = new Consultant(1L, "Dr. Smith", "smith@consulting.com", "Software Architecture");
        System.out.println("New Consultant Registered: " + consultant.getName() + " [Status: " + consultant.getStatus() + "]");

        // 2. Simulate an Admin Policy (Teammate's Code)
        SystemPolicy feePolicy = new SystemPolicy("platformFee", "10", "Percentage taken by platform");
        System.out.println("Current System Policy: " + feePolicy.getPolicyName() + " is " + feePolicy.getPolicyValue() + "%");

        // 3. Create a Payment Request (Your Code)
        PaymentRequest myRequest = new PaymentRequest();
        myRequest.setType("CREDIT_CARD");
        myRequest.setCardNumber("4111-2222-3333-4444");
        myRequest.setCvv("123");

        // 4. Execute Payment (Triggers Factory, Strategy, and Observer)
        System.out.println("\nProcessing $500.00 payment for " + consultant.getName() + "...");
        String txId = paymentService.executePayment(101L, "CREDIT_CARD", myRequest, 500.00);

        System.out.println("\nSUCCESS: Transaction ID: " + txId);
        System.out.println("--- TEST COMPLETED ---\n");
    }
}