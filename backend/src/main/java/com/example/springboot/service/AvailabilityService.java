package com.example.springboot.service;

import com.example.springboot.model.Availability;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

public interface AvailabilityService {
    void createAvailability(Long mentorId,
                            LocalDateTime start,
                            LocalDateTime end);
}
