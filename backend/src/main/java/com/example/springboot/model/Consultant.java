//package com.example.springboot.model;
//
//
//import com.example.springboot.model.Availability;
//import com.example.springboot.model.RegistrationStatus;
//import jakarta.persistence.*;
//import lombok.Data.*;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//
//@Entity
//public class Consultant {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private String id;
//
//    private String firstName;
//    private String lastName;
//
//    private String email;
//
//    private String bio;
//    private Double hourlyRate;
//
//    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL)
//    private List<Availability> availabilities = new ArrayList<>();
//
//    public static void addAvailability(Availability availability) {
//        availability.setConsultant(this);
//
//        this.availabilities.add(availability);
//    }
//
//
//
//    public void removeAvailability(Availability availability) {
//        this.availabilities.remove(availability);
//        availability.setConsultant(null);
//    }
//}

package com.example.springboot.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
public class Consultant extends AppUser {

    private String specialization;

    @Enumerated(EnumType.STRING) // Tells JPA to store "PENDING" instead of 0
    private RegistrationStatus status;
    
    private Double hourlyRate;

    private String location;
    
    @Column(length = 2000)
    private String bio;
    
    private String education;
    
    @Column(length = 4000)
    private String experiences;

    @OneToMany(mappedBy = "consultant", cascade = CascadeType.ALL)
    private List<Availability> availabilities = new ArrayList<>();

    // 1. MANDATORY: Default Constructor for JPA
    public Consultant() {}

    // 2. Your existing Constructor
    public Consultant(Long id, String name, String email, String specialization, Double hourlyRate) {
        this.setId(id);
        this.setName(name);
        this.setEmail(email);
        this.specialization = specialization;
        this.status = RegistrationStatus.PENDING;
        this.hourlyRate = hourlyRate;
    }

    // Getters and Setters
    public String getSpecialization() { return specialization; }
    public RegistrationStatus getStatus() { return status; }
    public Double getHourlyRate(){ return hourlyRate; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getExperiences() { return experiences; }
    public void setExperiences(String experiences) { this.experiences = experiences; }

    public void setStatus(RegistrationStatus status) { this.status = status; }

    // Relationship Helpers
    public void addAvailability(Availability availability) {
        availability.setConsultant(this);
        this.availabilities.add(availability);
    }

    public void removeAvailability(Availability availability) {
        this.availabilities.remove(availability);
        availability.setConsultant(null);
    }

    @Override
    public String toString() {
        return "Consultant{id=" + getId() + ", name='" + getName() + "', email='" + getEmail() +
               "', specialization='" + specialization + "', status=" + status + "}";
    }

    
}