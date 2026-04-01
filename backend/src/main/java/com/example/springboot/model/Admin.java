package com.example.springboot.model;

import jakarta.persistence.Entity;

@Entity
public class Admin extends AppUser {

    private String adminRole;

    public Admin() {}

    public String getAdminRole() { return adminRole; }
    public void setAdminRole(String adminRole) { this.adminRole = adminRole; }
}
