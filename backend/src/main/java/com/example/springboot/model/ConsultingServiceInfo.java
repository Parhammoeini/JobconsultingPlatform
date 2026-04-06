package com.example.springboot.model;

import jakarta.persistence.*;

/**
 * Represents a consulting service that clients can browse (UC1).
 *
 * Each service has a type (e.g. "Resume Review"), a duration in minutes,
 * and a base price.  A consultant may offer one or more of these.
 */
@Entity
public class ConsultingServiceInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceType;
    private int durationMinutes;
    private double basePrice;
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultant_id")
    private Consultant consultant;

    // We can keep these temporary transient fields if needed for DTO compatibility or mapping, 
    // but ideally we extract info via the Consultant mapping now.
    @Transient
    private Long consultantId;
    @Transient
    private String consultantName;

    public ConsultingServiceInfo() {}

    public ConsultingServiceInfo(Long id,
                                 String serviceType,
                                 int durationMinutes,
                                 double basePrice,
                                 String description,
                                 Consultant consultant) {
        this.id = id;
        this.serviceType = serviceType;
        this.durationMinutes = durationMinutes;
        this.basePrice = basePrice;
        this.description = description;
        this.consultant = consultant;
        if(consultant != null) {
            this.consultantId = consultant.getId();
            this.consultantName = consultant.getName();
        }
    }

    // ---- Getters ----
    public Long getId() { return id; }
    public String getServiceType() { return serviceType; }
    public int getDurationMinutes() { return durationMinutes; }
    public double getBasePrice() { return basePrice; }
    public String getDescription() { return description; }
    public Long getConsultantId() { return consultantId; }
    public String getConsultantName() { return consultant != null ? consultant.getName() : consultantName; }

    public Consultant getConsultant() { return consultant; }
    public void setConsultant(Consultant consultant) { this.consultant = consultant; }

    // ---- Setters ----
    public void setId(Long id) { this.id = id; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }
    public void setDescription(String description) { this.description = description; }
    public void setConsultantId(Long consultantId) { this.consultantId = consultantId; }
    public void setConsultantName(String consultantName) { this.consultantName = consultantName; }

    @Override
    public String toString() {
        return "ConsultingServiceInfo{" +
                "id=" + id +
                ", serviceType='" + serviceType + '\'' +
                ", durationMinutes=" + durationMinutes +
                ", basePrice=" + basePrice +
                ", consultant='" + consultantName + '\'' +
                '}';
    }
}