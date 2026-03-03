package com.example.springboot.model;

/**
 * Represents a configurable system policy set by the Admin.
 * Used by UC12 – Define System Policies.
 *
 * Examples:
 *   policyName = "cancellationWindowHours", policyValue = "24"
 *   policyName = "refundPercentage",         policyValue = "80"
 *   policyName = "platformFeePercentage",    policyValue = "10"
 *   policyName = "notificationsEnabled",     policyValue = "true"
 */
public class SystemPolicy {
    private String policyName;
    private String policyValue;
    private String description;

    public SystemPolicy(String policyName, String policyValue, String description) {
        this.policyName = policyName;
        this.policyValue = policyValue;
        this.description = description;
    }

    public String getPolicyName() { return policyName; }
    public String getPolicyValue() { return policyValue; }
    public String getDescription() { return description; }

    public void setPolicyValue(String policyValue) { this.policyValue = policyValue; }

    @Override
    public String toString() {
        return "SystemPolicy{name='" + policyName + "', value='" + policyValue +
               "', description='" + description + "'}";
    }
}