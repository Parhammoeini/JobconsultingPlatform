package com.example.springboot.repository;

import com.example.springboot.model.ConsultingServiceInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultingServiceRepository extends JpaRepository<ConsultingServiceInfo, Long> {
}
