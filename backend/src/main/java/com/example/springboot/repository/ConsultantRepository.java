package com.example.springboot.repository;


import com.example.springboot.model.Consultant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultantRepository extends JpaRepository<Consultant, Long>  {

    List<Consultant> findByHourlyRate(Double hourlyRate);

    List<Consultant> findByEmail(String email);
    List<Consultant> findByName(String name);

}