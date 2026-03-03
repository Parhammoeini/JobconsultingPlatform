package com.example.springboot.model;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * PolicyManager – SINGLETON DESIGN PATTERN
 *
 * Used by UC12 – Define System Policies.
 */
public class PolicyManager {

    // The single instance — private so nothing outside can create another
    private static PolicyManager instance;

    // Stores all policies by name for fast lookup
    private final Map<String, SystemPolicy> policies = new HashMap<>();

    // Private constructor — prevents anyone from calling "new PolicyManager()"
    private PolicyManager() {
        loadDefaultPolicies();
    }

    /**
     * The global access point to the single instance.
     * Creates it on first call, then returns the same one every time.
     */
    public static PolicyManager getInstance() {
        if (instance == null) {
            instance = new PolicyManager();
        }
        return instance;
    }

    /**
     * Loads sensible default policies on startup.
     * Admin can override any of these via UC12.
     */
    private void loadDefaultPolicies() {
        addOrUpdatePolicy("cancellationWindowHours", "24",
                "Hours before session within which cancellation is allowed");
        addOrUpdatePolicy("refundPercentage", "80",
                "Percentage of payment refunded on cancellation");
        addOrUpdatePolicy("platformFeePercentage", "10",
                "Platform fee taken from each booking payment");
        addOrUpdatePolicy("notificationsEnabled", "true",
                "Whether email/system notifications are sent to users");
        addOrUpdatePolicy("maxBookingsPerClient", "5",
                "Maximum active bookings a client can have at once");
    }

    /**
     * Add a new policy or update an existing one.
     * Called by the Admin via UC12.
     */
    public void addOrUpdatePolicy(String name, String value, String description) {
        policies.put(name, new SystemPolicy(name, value, description));
    }

    /**
     * Retrieve a policy by name.
     * Returns null if no policy with that name exists.
     */
    public SystemPolicy getPolicy(String name) {
        return policies.get(name);
    }

    /**
     * Convenience method — get a policy value directly as a String.
     * Returns defaultValue if the policy doesn't exist.
     */
    public String getPolicyValue(String name, String defaultValue) {
        SystemPolicy policy = policies.get(name);
        return (policy != null) ? policy.getPolicyValue() : defaultValue;
    }

    /**
     * Returns all current policies (e.g. for the admin dashboard view).
     */
    public Collection<SystemPolicy> getAllPolicies() {
        return policies.values();
    }

    /**
     * Remove a policy by name.
     */
    public boolean removePolicy(String name) {
        return policies.remove(name) != null;
    }
}
