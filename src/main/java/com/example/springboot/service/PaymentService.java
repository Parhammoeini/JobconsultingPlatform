package com.example.springboot.service;

import com.example.springboot.model.*;
import com.example.springboot.observer.PaymentObserver;
import com.example.springboot.factory.PaymentStrategyFactory;
import com.example.springboot.strategy.PaymentStrategy;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class PaymentService {
    private final PaymentStrategyFactory strategyFactory;
    private final List<PaymentObserver> observers = new ArrayList<>();

    public PaymentService(PaymentStrategyFactory strategyFactory) {
        this.strategyFactory = strategyFactory;
    }

    public void addObserver(PaymentObserver observer) {
        observers.add(observer);
    }

    public String executePayment(Long clientId, String method, PaymentRequest request, double amount) {
        // Get the strategy from Factory
        PaymentStrategy strategy = strategyFactory.getStrategy(method);
        
        // Validate the specific payment method (Req 5.1.1)
        if (strategy.validate(request)) {
            
            try {
                // 3. Simulated 3-second delay (Req 5.1.2)
                System.out.println("Processing payment... please wait.");
                Thread.sleep(3000); 
                
                // 4. Generate Unique Transaction ID (Req 5.1.2)
                String txnId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                
                // 5. Process and Notify Observers (Updates Booking State & History)
                strategy.process(amount);
                
                for (PaymentObserver observer : observers) {
                    observer.onPaymentSuccess(clientId, txnId, amount);
                }
                
                return txnId;
            } catch (InterruptedException e) {
                return "ERROR";
            }
        }
        return "VALIDATION_FAILED";
    }
}