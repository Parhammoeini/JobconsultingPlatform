package com.example.springboot.repository;

import com.example.springboot.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    List<AppUser> findByName(String name);
    List<AppUser> findByEmail(String email);
}