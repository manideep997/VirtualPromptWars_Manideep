package com.sentientstadium.model;

import java.util.Map;

public class ChatRequest {
    private String prompt;
    private Map<String, Object> liveTelemetry;

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public Map<String, Object> getLiveTelemetry() { return liveTelemetry; }
    public void setLiveTelemetry(Map<String, Object> liveTelemetry) { this.liveTelemetry = liveTelemetry; }
}
