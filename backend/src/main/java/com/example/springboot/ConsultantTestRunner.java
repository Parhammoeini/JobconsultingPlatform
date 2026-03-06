package com.example.springboot.runner;
import com.example.springboot.service.ConsultingServiceCatalogService;
import com.example.springboot.model.*;
import com.example.springboot.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class ConsultantTestRunner implements CommandLineRunner {

    private final AdminService adminService;
    private final AvailabilityService availabilityService;
    @Autowired
    private ConsultingServiceCatalogService consultingServiceCatalogService;

    public ConsultantTestRunner(AdminService adminService, AvailabilityService availabilityService) {
        this.adminService = adminService;
        this.availabilityService = availabilityService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n--- TESTING CONSULTANT & AVAILABILITY LOGIC ---");

        // 1. Test Consultant Registration (UC11)
        System.out.println("Step 1: Registering a new Consultant...");
        Consultant alice = adminService.registerConsultant("Alice Java", "alice@pro.com", "Backend Architecture");
        System.out.println("Consultant Registered with ID: " + alice.getId() + " | Status: " + alice.getStatus());

        // 2. Test Admin Approval
        System.out.println("Step 2: Approving Consultant...");
        adminService.approveConsultant(alice.getId());
        System.out.println("Consultant Approved. Current Count of Approved: " + adminService.getApprovedConsultants().size());
        // 3. Test Availability Creation (JPA Relationship)
        System.out.println("Step 3: Creating Availability Slots...");
        try {
            LocalDateTime start = LocalDateTime.now().plusDays(2);
            LocalDateTime end = start.plusHours(1);
            availabilityService.createAvailability(alice.getId(), start, end);
            System.out.println("SUCCESS: Slot created for " + alice.getName());
        } catch (Exception e) {
            System.err.println("FAILURE: Could not link availability to consultant: " + e.getMessage());
        }


        System.out.println("\n--- TESTING SAMS CLIENT LOGIC ---");
    try {
        // Let's see if her service can find the consultant you just made
        var services = consultingServiceCatalogService.browseAllServices(); 
        System.out.println("Available Services in Catalog: " + services.size());
        
        // Try to trigger a booking logic check
        System.out.println("Checking Policy via her Service: " + 
            PolicyManager.getInstance().getPolicyValue("cancellationWindowHours", "default"));
        
        System.out.println("SUCCESS: Teammate's logic is integrated with PolicyManager.");
    } catch (Exception e) {
        System.out.println("FAILURE: Integration issue: " + e.getMessage());
    }



        // 4. Test Policy (Updated to match your SystemPolicy method names)
        adminService.setPolicy("PLATFORM_FEE", "15%", "Standard platform commission");
        SystemPolicy feePolicy = adminService.getPolicy("PLATFORM_FEE");

        if (feePolicy != null) {
        // We must use getPolicyName() and getPolicyValue() here!
        System.out.println("Retrieved Policy: " + feePolicy.getPolicyName() + " = " + feePolicy.getPolicyValue());
}

        
       

        System.out.println("--- BACKEND TESTS FINISHED ---\n");
    }
}