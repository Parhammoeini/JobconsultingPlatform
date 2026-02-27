package com.example.springboot.service;

import com.example.springboot.factory.PaymentStrategyFactory; 
import com.example.springboot.observer.PaymentObserver;      
import com.example.springboot.model.PaymentRequest;
import com.example.springboot.strategy.PaymentStrategy;
import org.springframework.stereotype.Service;
import java.util.*;
@Service
public class PaymentService {
    private final PaymentStrategyFactory strategyFactory;
    private final List<PaymentObserver> observers = new ArrayList<>();

    public PaymentService(PaymentStrategyFactory strategyFactory, PaymentHistoryService historyService) {
        this.strategyFactory = strategyFactory;
        this.observers.add(historyService); // Register the history service as an observer
    }

    public String executePayment(Long clientId, String method, PaymentRequest request, double amount) {
        PaymentStrategy strategy = strategyFactory.getStrategy(method);
        
        if (!strategy.validate(request)) {
            throw new RuntimeException("Validation Failed");
        }

        String txnId = strategy.process(amount);

        // Notify all observers (Observer Pattern)
        for (PaymentObserver observer : observers) {
            observer.onPaymentSuccess(clientId, txnId, amount);
        }

        return txnId;
    }
}