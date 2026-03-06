package com.example.springboot.model;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * PolicyManager - Singleton pattern to manage system-wide policies.
 */
public class PolicyManager {

    private static PolicyManager instance;
    private final Map<String, SystemPolicy> policies = new HashMap<>();

    private PolicyManager() {
        loadDefaultPolicies();
    }

    public static PolicyManager getInstance() {
        if (instance == null) {
            instance = new PolicyManager();
        }
        return instance;
    }

    private void loadDefaultPolicies() {
        addOrUpdatePolicy("cancellationWindowHours", "24", "Hours before session within which cancellation is allowed");
        addOrUpdatePolicy("refundPercentage", "80", "Percentage of payment refunded on cancellation");
        addOrUpdatePolicy("PLATFORM_FEE", "15%", "Standard platform commission");
    }

    public void addOrUpdatePolicy(String name, String value, String description) {
        policies.put(name, new SystemPolicy(name, value, description));
    }

    public void setPolicy(String name, String value, String description) {
        addOrUpdatePolicy(name, value, description);
    }

    public SystemPolicy getPolicy(String name) {
        return policies.get(name);
    }

    /**
     * Helper method used by ClientBookingService to get values directly.
     */
    public String getPolicyValue(String name, String defaultValue) {
        SystemPolicy policy = policies.get(name);
        return (policy != null) ? policy.getPolicyValue() : defaultValue;
    }

    public Collection<SystemPolicy> getAllPolicies() {
        return policies.values();
    }

    public boolean removePolicy(String name) {
        return policies.remove(name) != null;
    }
}