package com.example.springboot.controller;

import com.example.springboot.model.*;
import com.example.springboot.service.BookingLifecycleService;
import com.example.springboot.service.ClientBookingService;
import com.example.springboot.service.ConsultingServiceCatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * ClientController – REST API for client use-cases.
 *
 *   UC1 – Browse Consulting Services   GET  /api/client/services
 *   UC2 – Request a Booking            POST /api/client/bookings
 *   UC3 – Cancel a Booking             PUT  /api/client/bookings/{id}/cancel
 *
 * Base URL: /api/client
 */
@CrossOrigin(origins = "http://localhost:3000") // ADD THIS LINE
@RestController
@RequestMapping("/api/client")
public class ClientController {

    private final ConsultingServiceCatalogService catalogService;
    private final ClientBookingService bookingService;
    private final BookingLifecycleService lifecycleService;

    public ClientController(ConsultingServiceCatalogService catalogService,
                            ClientBookingService bookingService,
                            BookingLifecycleService lifecycleService) {
        this.catalogService = catalogService;
        this.bookingService = bookingService;
        this.lifecycleService = lifecycleService;
    }

    // ===================================================================
    // UC1 – Browse Consulting Services
    // ===================================================================

    /**
     * GET /api/client/services
     * Returns all available consulting services (service type, duration, base price).
     *
     * Optional query params:
     *   ?type=resume        – filter by service type keyword
     *   ?consultantId=1     – filter by consultant
     */
    @GetMapping("/services")
    public ResponseEntity<List<ConsultingServiceInfo>> browseServices(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long consultantId) {

        List<ConsultingServiceInfo> results;

        if (type != null && !type.isBlank()) {
            results = catalogService.browseServicesByType(type);
        } else if (consultantId != null) {
            results = catalogService.browseServicesByConsultant(consultantId);
        } else {
            results = catalogService.browseAllServices();
        }

        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/client/services/{id}
     * Returns a single consulting service by id.
     */
    @GetMapping("/services/{id}")
    public ResponseEntity<ConsultingServiceInfo> getService(@PathVariable Long id) {
        ConsultingServiceInfo info = catalogService.getServiceById(id);
        if (info == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(info);
    }

    // ===================================================================
    // UC2 – Request a Booking
    // ===================================================================

    /**
     * POST /api/client/bookings
     *
     * Request body:
     * {
     *   "clientId": 101,
     *   "consultantId": 1,
     *   "availabilitySlotId": 1,
     *   "serviceId": 2
     * }
     *
     * The system validates availability, creates a Booking in the REQUESTED
     * state, and marks the availability slot as BOOKED.
     */
    @PostMapping("/bookings")
    public ResponseEntity<?> requestBooking(@RequestBody BookingRequestDTO request) {
        try {
            Booking booking = bookingService.requestBooking(request);
            return ResponseEntity.ok(booking);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // ===================================================================
    // UC3 – Cancel a Booking
    // ===================================================================

    /**
     * PUT /api/client/bookings/{id}/cancel
     *
     * Request body:
     * {
     *   "clientId": 101
     * }
     *
     * Applies cancellation rules (time-based policy) and updates the
     * booking state to CANCELLED if allowed.
     */
    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<CancellationResult> cancelBooking(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {

        Long clientId = body.get("clientId");
        if (clientId == null) {
            CancellationResult err = new CancellationResult(
                    id, false, null, null, "clientId is required", 0);
            return ResponseEntity.badRequest().body(err);
        }

        CancellationResult result = bookingService.cancelBooking(id, clientId);

        if (!result.isSuccess()) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    // ===================================================================
    // Supporting endpoints
    // ===================================================================

    /**
     * GET /api/client/bookings?clientId=101
     * Returns all bookings for a given client.
     */
    @GetMapping("/bookings")
    public ResponseEntity<?> getBookings(@RequestParam Long clientId) {
        List<Booking> list = bookingService.getBookingsForClient(clientId);
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/client/bookings/{id}
     * Returns a single booking by id.
     */
    @GetMapping("/bookings/{id}")
    public ResponseEntity<?> getBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(booking);
    }

    /**
     * GET /api/client/bookings/{id}/transitions
     * Returns the set of allowed next states for the given booking
     * (useful for the UI to show available actions).
     */
    @GetMapping("/bookings/{id}/transitions")
    public ResponseEntity<?> getAllowedTransitions(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        Set<BookingState> allowed = lifecycleService.allowedTransitions(booking.getState());
        List<String> labels = allowed.stream()
                .map(BookingState::getLabel)
                .collect(Collectors.toList());
        return ResponseEntity.ok(Map.of(
                "bookingId", id,
                "currentState", booking.getState(),
                "allowedTransitions", labels
        ));
    }
    @GetMapping("/consultants")
    public ResponseEntity<List<Consultant>> getAllConsultants() {
    return ResponseEntity.ok(catalogService.browseAllConsultants());
}

    @org.springframework.beans.factory.annotation.Autowired
    private com.example.springboot.repository.ConsultantRepository consultantRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Simple lookup: check if a consultant exists with this email/username
        // We assume the user logs in using the email they signed up with.
        java.util.List<Consultant> consultants = consultantRepository.findByEmail(username);
        if (consultants.isEmpty()) {
            // Not found as consultant, treat as standard client
            return ResponseEntity.ok(Map.<String, Object>of(
                "role", "CLIENT", 
                "message", "Login successful"
            ));
        }

        Consultant consultant = consultants.get(0);
        if (consultant.getPassword() != null && !consultant.getPassword().equals(password)) {
             return ResponseEntity.status(401).body(Map.<String, Object>of("error", "Invalid password"));
        }
        // Update password if null (first login after registration or just auto-syncing)
        if (consultant.getPassword() == null) {
            consultant.setPassword(password);
            consultantRepository.save(consultant);
        }
        if (consultant.getStatus() == RegistrationStatus.APPROVED) {
            return ResponseEntity.ok(Map.<String, Object>of(
                "role", "CONSULTANT", 
                "status", "APPROVED", 
                "message", "Login successful",
                "id", consultant.getId()
            ));
        } else {
            return ResponseEntity.ok(Map.<String, Object>of(
                "role", "CLIENT", 
                "status", consultant.getStatus().name(), 
                "message", "Login successful",
                "id", consultant.getId()
            ));
        }
    }
}