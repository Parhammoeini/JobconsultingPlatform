package com.example.springboot.factory;

import com.example.springboot.strategy.PaymentStrategy;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PaymentStrategyFactory {
    private final Map<String, PaymentStrategy> strategies = new HashMap<>();

    public PaymentStrategyFactory(List<PaymentStrategy> strategyList) {
        for (PaymentStrategy strategy : strategyList) {
            strategies.put(strategy.getMethodName().toUpperCase(), strategy);
        }
    }

    public PaymentStrategy getStrategy(String method) {
        PaymentStrategy strategy = strategies.get(method.toUpperCase());
        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported payment method: " + method);
        }
        return strategy;
    }
}