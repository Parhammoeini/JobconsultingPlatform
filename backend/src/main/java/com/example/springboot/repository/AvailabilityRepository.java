package com.example.springboot.repository;

import com.example.springboot.model.Availability;
import com.example.springboot.model.AvailabilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByConsultant_Id(Long consultantId);

    List<Availability> findByStatus(AvailabilityStatus status);
}
