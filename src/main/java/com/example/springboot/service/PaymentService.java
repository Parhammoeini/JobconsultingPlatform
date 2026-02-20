package com.example.springboot.service;

import com.example.springboot.strategy.PaymentStrategy;
import com.example.springboot.model.PaymentRequest;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class PaymentService {
    // This map automatically stores all your strategies
    private final Map<String, PaymentStrategy> strategies = new HashMap<>();

    public PaymentService(List<PaymentStrategy> strategyList) {
        for (PaymentStrategy s : strategyList) {
            strategies.put(s.getMethodName(), s);
        }
    }

    public String executePayment(String method, PaymentRequest request, double amount) {
        PaymentStrategy strategy = strategies.get(method);
        
        // 1. Validate (Req 5.1.2.2)
        if (strategy == null || !strategy.validate(request)) {
            throw new RuntimeException("Validation Failed");
        }

        // 2. Process (Req 5.1.2.3)
        String txnId = strategy.process(amount);

        // 3. Update state (This is where you'd call the Booking Repository)
        System.out.println("Booking updated to PAID with ID: " + txnId);
        
        return txnId;
    }
}