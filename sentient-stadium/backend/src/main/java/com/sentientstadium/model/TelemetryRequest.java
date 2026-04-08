package com.sentientstadium.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TelemetryRequest {

    @NotBlank(message = "Gate ID or Name cannot be blank")
    private String gateId;

    @NotNull(message = "Wait time must be provided")
    @Min(value = 0, message = "Wait time cannot be negative")
    private Integer waitTimeMinutes;

    @NotNull(message = "Crowd delta must be provided")
    private Integer crowdDelta;

    // Getters and Setters
    public String getGateId() { return gateId; }
    public void setGateId(String gateId) { this.gateId = gateId; }
    public Integer getWaitTimeMinutes() { return waitTimeMinutes; }
    public void setWaitTimeMinutes(Integer waitTimeMinutes) { this.waitTimeMinutes = waitTimeMinutes; }
    public Integer getCrowdDelta() { return crowdDelta; }
    public void setCrowdDelta(Integer crowdDelta) { this.crowdDelta = crowdDelta; }
}
