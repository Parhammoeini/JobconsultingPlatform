package com.example.springboot.controller;

import com.example.springboot.service.PaymentService;
import com.example.springboot.model.PaymentRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // A simple GET request to test if UC5 (Process Payment) works
    @GetMapping("/test")
    public String testPayment() {
        PaymentRequest request = new PaymentRequest();
        request.setType("CREDIT_CARD");
        request.setCardNumber("1234567812345678");
        request.setExpiryDate("12/30");
        request.setCvv("123");

        // Simulate a payment for Client 101, Amount $150.00
        String txnId = paymentService.executePayment(101L, "CREDIT_CARD", request, 150.00);
        
        return "Payment Successful! Transaction ID: " + txnId + " (Check console for 3s delay)";
    }
}