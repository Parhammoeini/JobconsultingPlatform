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
        // TEST 1: PayPal Logic
System.out.println("--- TESTING PAYPAL ---");
PaymentRequest paypalReq = new PaymentRequest();
paypalReq.setEmail("user@example.com");
paymentService.executePayment(101L, "PAYPAL", paypalReq, 50.0);

// TEST 2: Bank Transfer Logic
System.out.println("\n--- TESTING BANK TRANSFER ---");
PaymentRequest bankReq = new PaymentRequest();
bankReq.setAccountNumber("12345678");
bankReq.setRoutingNumber("987654321");
paymentService.executePayment(102L, "BANK_TRANSFER", bankReq, 150.0);
    }
}