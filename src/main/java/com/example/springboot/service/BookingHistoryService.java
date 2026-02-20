package com.example.springboot.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingHistoryService {
    // Samantha you will provide the actual Repository, this is the skeleton
    public List<Object> getHistory(Long clientId) {
        // Return list of bookings from DB
        return new ArrayList<>(); 
    }
}