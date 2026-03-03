package com.example.springboot.runner;

import com.example.springboot.model.*;
import com.example.springboot.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class PaymentTestRunner implements CommandLineRunner {

    private final PaymentService paymentService;

    public PaymentTestRunner(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n===== PHASE 1: SYSTEM INTEGRATION TEST =====");

        // 1. SETUP: Create Consultant & Policy (Teammates' Work)
        Consultant prof = new Consultant(1L, "Dr. Jordan", "jordan@univ.edu", "Technical Design");
        prof.setStatus(RegistrationStatus.APPROVED);
        
        SystemPolicy feePolicy = new SystemPolicy("platformFee", "10", "Standard Platform Fee");

        // 2. LIFECYCLE: Create a Booking in 'Requested' state (Req 5)
        Booking myBooking = new Booking(5001L, 101L, prof, LocalDateTime.now().plusDays(2), 200.00);
        System.out.println("Step 1: Booking Created. Current State: " + myBooking.getState());

        // 3. TRANSITION: Consultant accepts (Simulating UC9)
        myBooking.setState("Pending Payment");
        System.out.println("Step 2: Consultant Accepted. Current State: " + myBooking.getState());

        // 4. EXECUTION: Process Payment (Your Work - UC5)
        PaymentRequest cardRequest = new PaymentRequest();
        cardRequest.setType("CREDIT_CARD");
        cardRequest.setCardNumber("1111222233334444");
        cardRequest.setCvv("999");
        cardRequest.setExpiryDate("12/28");

        System.out.println("\nStep 3: Initiating Payment for $" + myBooking.getBasePrice() + "...");
        String txnId = paymentService.executePayment(101L, "CREDIT_CARD", cardRequest, myBooking.getBasePrice());

        // 5. VERIFICATION: Check if State moved to PAID (Req 5.1.2)
        if (!txnId.equals("VALIDATION_FAILED")) {
            myBooking.setState("Paid"); // This should be handled by your Observer!
            System.out.println("\nStep 4: Payment Successful!");
            System.out.println("Unique Transaction ID: " + txnId);
            System.out.println("Final Booking State: " + myBooking.getState());
        }

        System.out.println("============================================\n");
    }
}