package com.example.springboot.service;

import com.example.springboot.model.Consultant;
import com.example.springboot.model.ConsultingServiceInfo;
import com.example.springboot.model.RegistrationStatus;
import com.example.springboot.repository.ConsultantRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * UC1 – Browse Consulting Services.
 *
 * Manages a catalogue of consulting services.  Each service is linked to
 * an approved consultant and exposes service type, duration, and base price
 * so that clients can browse before booking.
 *
 * Seed data is loaded on construction so there is something to browse
 * immediately after the application starts.
 */
@Service
public class ConsultingServiceCatalogService {

    private final ConsultantRepository consultantRepository;
    private final List<ConsultingServiceInfo> catalog = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public ConsultingServiceCatalogService(ConsultantRepository consultantRepository) {
        this.consultantRepository = consultantRepository;
        loadSeedData();
    }

    // -----------------------------------------------------------------------
    // UC1 – Browse Consulting Services
    // -----------------------------------------------------------------------

    /**
     * Returns all available consulting services.
     * Only services whose consultant is APPROVED are included.
     */
    public List<ConsultingServiceInfo> browseAllServices() {
        return catalog.stream()
                .filter(s -> isConsultantApproved(s.getConsultantId()))
                .collect(Collectors.toList());
    }

    /**
     * Filter services by type keyword (case-insensitive).
     */
    public List<ConsultingServiceInfo> browseServicesByType(String typeKeyword) {
        return browseAllServices().stream()
                .filter(s -> s.getServiceType().toLowerCase()
                        .contains(typeKeyword.toLowerCase()))
                .collect(Collectors.toList());
    }

    /**
     * Filter services by consultant id.
     */
    public List<ConsultingServiceInfo> browseServicesByConsultant(Long consultantId) {
        return browseAllServices().stream()
                .filter(s -> s.getConsultantId().equals(consultantId))
                .collect(Collectors.toList());
    }

    /**
     * Get a single service by id (returns null if not found).
     */
    public ConsultingServiceInfo getServiceById(Long serviceId) {
        return catalog.stream()
                .filter(s -> s.getId().equals(serviceId))
                .findFirst()
                .orElse(null);
    }

    /**
     * Admin or consultant can add a new service to the catalogue.
     */
    public ConsultingServiceInfo addService(String serviceType,
                                            int durationMinutes,
                                            double basePrice,
                                            String description,
                                            Long consultantId) {
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new IllegalArgumentException("Consultant not found with id: " + consultantId));

        ConsultingServiceInfo info = new ConsultingServiceInfo(
                idGenerator.getAndIncrement(),
                serviceType,
                durationMinutes,
                basePrice,
                description,
                consultant
        );

        catalog.add(info);
        System.out.println("Service added to catalog: " + info);
        return info;
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private boolean isConsultantApproved(Long consultantId) {
        // If the consultant is not in DB yet (seed data placeholder), still show
        return consultantRepository.findById(consultantId)
                .map(c -> c.getStatus() == RegistrationStatus.APPROVED)
                .orElse(true); // allow seed data to show
    }

    /**
     * Pre-populates the catalogue so that UC1 works out-of-the-box.
     */
    private void loadSeedData() {
        // Create dummy consultants for seed data since we can't guarantee IDs
        Consultant seedConsultantA = new Consultant();
        seedConsultantA.setId(1L);
        seedConsultantA.setName("Seed Consultant A");

        Consultant seedConsultantB = new Consultant();
        seedConsultantB.setId(2L);
        seedConsultantB.setName("Seed Consultant B");

        Consultant seedConsultantC = new Consultant();
        seedConsultantC.setId(3L);
        seedConsultantC.setName("Seed Consultant C");

        catalog.add(new ConsultingServiceInfo(
                idGenerator.getAndIncrement(),
                "Resume Review",
                30,
                49.99,
                "Professional review and feedback on your resume",
                seedConsultantA
        ));
        catalog.add(new ConsultingServiceInfo(
                idGenerator.getAndIncrement(),
                "Mock Interview",
                60,
                89.99,
                "One-on-one mock interview with industry expert",
                seedConsultantA
        ));
        catalog.add(new ConsultingServiceInfo(
                idGenerator.getAndIncrement(),
                "Career Strategy Session",
                45,
                74.99,
                "Personalised career roadmap and goal setting",
                seedConsultantB
        ));
        catalog.add(new ConsultingServiceInfo(
                idGenerator.getAndIncrement(),
                "LinkedIn Profile Optimisation",
                30,
                39.99,
                "Optimise your LinkedIn presence for recruiters",
                seedConsultantB
        ));
        catalog.add(new ConsultingServiceInfo(
                idGenerator.getAndIncrement(),
                "Salary Negotiation Coaching",
                60,
                99.99,
                "Expert guidance for negotiating job offers",
                seedConsultantC
        ));

        System.out.println("Consulting service catalogue loaded with " + catalog.size() + " seed entries.");
    }
}