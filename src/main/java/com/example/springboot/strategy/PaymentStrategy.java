package com.example.springboot.strategy;

import com.example.springboot.model.PaymentRequest;

public interface PaymentStrategy {
    boolean validate(PaymentRequest details);
    String process(double amount);
    String getMethodName(); //To identify the strategy
}