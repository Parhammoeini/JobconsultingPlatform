package com.example.springboot.model;

/**
 * Represents a consulting service that clients can browse (UC1).
 *
 * Each service has a type (e.g. "Resume Review"), a duration in minutes,
 * and a base price.  A consultant may offer one or more of these.
 */
public class ConsultingServiceInfo {

    private Long id;
    private String serviceType;
    private int durationMinutes;
    private double basePrice;
    private String description;
    private Long consultantId;
    private String consultantName;

    public ConsultingServiceInfo() {}

    public ConsultingServiceInfo(Long id,
                                 String serviceType,
                                 int durationMinutes,
                                 double basePrice,
                                 String description,
                                 Long consultantId,
                                 String consultantName) {
        this.id = id;
        this.serviceType = serviceType;
        this.durationMinutes = durationMinutes;
        this.basePrice = basePrice;
        this.description = description;
        this.consultantId = consultantId;
        this.consultantName = consultantName;
    }

    // ---- Getters ----
    public Long getId() { return id; }
    public String getServiceType() { return serviceType; }
    public int getDurationMinutes() { return durationMinutes; }
    public double getBasePrice() { return basePrice; }
    public String getDescription() { return description; }
    public Long getConsultantId() { return consultantId; }
    public String getConsultantName() { return consultantName; }

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
