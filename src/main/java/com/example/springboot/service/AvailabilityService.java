package com.example.springboot.service;


import java.time.LocalDateTime;


public interface AvailabilityService {
    void createAvailability(Long mentorId,
                            LocalDateTime start,
                            LocalDateTime end);
}
