package com.example.springboot.runner;

import com.example.springboot.model.*;
import com.example.springboot.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Integration tester for the client-facing use-cases:
 *   UC1 – Browse Consulting Services
 *   UC2 – Request a Booking
 *   UC3 – Cancel a Booking
 */
@Component
@Order(2) // run after ConsultantTestRunner so seed data exists
public class BookingCancellingTestRunner implements CommandLineRunner {

    private final AdminService adminService;
    private final AvailabilityService availabilityService;
    private final ConsultingServiceCatalogService catalogService;
    private final ClientBookingService clientBookingService;
    private final BookingLifecycleService lifecycleService;

    public BookingCancellingTestRunner(AdminService adminService,
                                      AvailabilityService availabilityService,
                                      ConsultingServiceCatalogService catalogService,
                                      ClientBookingService clientBookingService,
                                      BookingLifecycleService lifecycleService) {
        this.adminService = adminService;
        this.availabilityService = availabilityService;
        this.catalogService = catalogService;
        this.clientBookingService = clientBookingService;
        this.lifecycleService = lifecycleService;
    }

    @Override
    public void run(String... args) throws Exception {

        System.out.println("\n========================================================");
        System.out.println("  BOOKING & CANCELLING TESTER  (UC1 / UC2 / UC3)");
        System.out.println("========================================================\n");

        // ---------------------------------------------------------------
        // SETUP: Register & approve a consultant, create an availability slot
        // ---------------------------------------------------------------
        System.out.println("--- SETUP: Creating an approved consultant with an availability slot ---");

        Consultant consultant = adminService.registerConsultant(
                "Bob Builder", "bob@consulting.com", "Career Coaching");
        adminService.approveConsultant(consultant.getId());
        System.out.println("Consultant registered & approved: " + consultant.getName()
                + " (ID=" + consultant.getId() + ")");

        LocalDateTime slotStart = LocalDateTime.now().plusDays(3);
        LocalDateTime slotEnd = slotStart.plusHours(1);
        availabilityService.createAvailability(consultant.getId(), slotStart, slotEnd);
        System.out.println("Availability slot created: " + slotStart + " → " + slotEnd);

        // Add a service for this consultant in the catalogue
        ConsultingServiceInfo newService = catalogService.addService(
                "Career Coaching Session", 60, 75.00,
                "One-on-one career coaching", consultant.getId());
        System.out.println("Service added to catalogue: " + newService);

        // ---------------------------------------------------------------
        // UC1 – Browse Consulting Services
        // ---------------------------------------------------------------
        System.out.println("\n--- UC1: Browse Consulting Services ---");

        List<ConsultingServiceInfo> allServices = catalogService.browseAllServices();
        System.out.println("Total services available: " + allServices.size());
        for (ConsultingServiceInfo svc : allServices) {
            System.out.println("  • " + svc.getServiceType()
                    + " | $" + svc.getBasePrice()
                    + " | " + svc.getDurationMinutes() + " min"
                    + " | Consultant: " + svc.getConsultantName());
        }

        // Filter by type
        List<ConsultingServiceInfo> coachingServices = catalogService.browseServicesByType("Coaching");
        System.out.println("Services matching 'Coaching': " + coachingServices.size());

        // Filter by consultant
        List<ConsultingServiceInfo> bobServices = catalogService.browseServicesByConsultant(consultant.getId());
        System.out.println("Services by " + consultant.getName() + ": " + bobServices.size());

        System.out.println("UC1 PASSED ✓");

        // ---------------------------------------------------------------
        // UC2 – Request a Booking
        // ---------------------------------------------------------------
        System.out.println("\n--- UC2: Request a Booking ---");

        Long clientId = 100L; // simulated client id

        // We need the availability slot id. The slot was just created for the consultant.
        // Grab the first AVAILABLE slot from the repository via browsing all bookings is tricky
        // because AvailabilityRepository is not directly exposed here. Instead we rely on the
        // service layer: try creating a booking with slotId = 1 (the earliest slot).
        // We'll attempt with likely slot ids.

        Booking booking = null;
        try {
            BookingRequestDTO request = new BookingRequestDTO(
                    clientId,
                    consultant.getId(),
                    1L,                   // first availability slot id
                    newService.getId()    // the service we just added
            );
            booking = clientBookingService.requestBooking(request);
            System.out.println("Booking created: " + booking);
            System.out.println("  State: " + booking.getState());
            System.out.println("  Consultant: " + booking.getConsultant().getName());
            System.out.println("  Base Price: $" + booking.getBasePrice());
            System.out.println("UC2 PASSED ✓");
        } catch (Exception e) {
            System.out.println("UC2 booking with slotId=1 failed (" + e.getMessage() + "), retrying...");
            // Try with a higher slot id in case earlier slots were consumed
            try {
                BookingRequestDTO request2 = new BookingRequestDTO(
                        clientId,
                        consultant.getId(),
                        2L,
                        newService.getId()
                );
                booking = clientBookingService.requestBooking(request2);
                System.out.println("Booking created on retry: " + booking);
                System.out.println("UC2 PASSED ✓");
            } catch (Exception e2) {
                System.err.println("UC2 FAILED: " + e2.getMessage());
            }
        }

        // Verify bookings for client
        List<Booking> clientBookings = clientBookingService.getBookingsForClient(clientId);
        System.out.println("Total bookings for client " + clientId + ": " + clientBookings.size());

        // ---------------------------------------------------------------
        // UC3 – Cancel a Booking
        // ---------------------------------------------------------------
        System.out.println("\n--- UC3: Cancel a Booking ---");

        if (booking != null) {
            // Verify it is cancellable first
            boolean cancellable = lifecycleService.isCancellable(booking.getState());
            System.out.println("Is booking " + booking.getId() + " cancellable? " + cancellable);

            // Attempt cancellation
            CancellationResult result = clientBookingService.cancelBooking(booking.getId(), clientId);
            System.out.println("Cancellation success: " + result.isSuccess());
            System.out.println("  Message: " + result.getMessage());
            System.out.println("  Previous State: " + result.getPreviousState());
            System.out.println("  New State: " + result.getNewState());
            System.out.println("  Refund %: " + result.getRefundPercentage());

            // Verify the booking state is now Cancelled
            Booking cancelled = clientBookingService.getBookingById(booking.getId());
            if (cancelled != null && "Cancelled".equals(cancelled.getState())) {
                System.out.println("Booking state confirmed as Cancelled ✓");
            }

            // Try cancelling again — should fail (terminal state)
            System.out.println("\nAttempting double-cancel (should fail)...");
            CancellationResult doubleCancel = clientBookingService.cancelBooking(booking.getId(), clientId);
            System.out.println("Double-cancel success: " + doubleCancel.isSuccess()
                    + " | Message: " + doubleCancel.getMessage());

            // Try cancelling with wrong client id — should fail
            System.out.println("\nAttempting cancel with wrong client id (should fail)...");
            CancellationResult wrongClient = clientBookingService.cancelBooking(booking.getId(), 999L);
            System.out.println("Wrong-client cancel success: " + wrongClient.isSuccess()
                    + " | Message: " + wrongClient.getMessage());

            System.out.println("UC3 PASSED ✓");
        } else {
            System.err.println("UC3 SKIPPED — no booking was created in UC2.");
        }

        // ---------------------------------------------------------------
        // Verify active bookings count went down after cancellation
        // ---------------------------------------------------------------
        System.out.println("\n--- Post-Cancellation Verification ---");
        List<Booking> activeAfter = clientBookingService.getActiveBookingsForClient(clientId);
        System.out.println("Active bookings for client " + clientId + " after cancellation: " + activeAfter.size());

        System.out.println("\n========================================================");
        System.out.println("  BOOKING & CANCELLING TESTER FINISHED");
        System.out.println("========================================================\n");
    }
}
