package com.example.springboot.model;

/**
 * DTO used by a client to submit a booking request (UC2).
 */
public class BookingRequestDTO {

    private Long clientId;
    private Long consultantId;
    private Long availabilitySlotId;
    private Long serviceId;

    public BookingRequestDTO() {}

    public BookingRequestDTO(Long clientId, Long consultantId, Long availabilitySlotId, Long serviceId) {
        this.clientId = clientId;
        this.consultantId = consultantId;
        this.availabilitySlotId = availabilitySlotId;
        this.serviceId = serviceId;
    }

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }

    public Long getConsultantId() { return consultantId; }
    public void setConsultantId(Long consultantId) { this.consultantId = consultantId; }

    public Long getAvailabilitySlotId() { return availabilitySlotId; }
    public void setAvailabilitySlotId(Long availabilitySlotId) { this.availabilitySlotId = availabilitySlotId; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
}
