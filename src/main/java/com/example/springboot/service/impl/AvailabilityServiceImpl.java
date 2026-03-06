package com.example.springboot.service.impl;

import com.example.springboot.model.Availability;
import com.example.springboot.model.AvailabilityFactory;
import com.example.springboot.model.Consultant;
import com.example.springboot.repository.AvailabilityRepository;
import com.example.springboot.repository.ConsultantRepository;
import com.example.springboot.service.AvailabilityService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AvailabilityServiceImpl implements AvailabilityService {
    private final ConsultantRepository consultantRepository;
    private final AvailabilityFactory availabilityFactory;

    public AvailabilityServiceImpl(ConsultantRepository consultantRepository,
                                   AvailabilityFactory availabilityFactory
    ){
        this.consultantRepository = consultantRepository;
        this.availabilityFactory = availabilityFactory;
    }

    @Override
    public void createAvailability(Long mentorId, LocalDateTime start, LocalDateTime end) {
        Consultant mentor = consultantRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        Availability availability =
                AvailabilityFactory.create(start, end);

        mentor.addAvailability(availability);

        consultantRepository.save(mentor);
    }
}
