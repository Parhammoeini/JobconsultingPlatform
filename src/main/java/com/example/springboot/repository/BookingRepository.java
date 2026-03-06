package com.example.springboot.repository;

import com.example.springboot.model.Consultant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<com.example.springboot.model.Booking, Long> {
    List<BookingRepository> findByConsultant(Consultant consultant);
}