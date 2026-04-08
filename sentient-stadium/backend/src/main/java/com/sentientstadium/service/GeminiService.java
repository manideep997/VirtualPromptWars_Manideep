package com.sentientstadium.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final String apiKey;
    private String stadiumContextCache = null;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
        this.apiKey = System.getenv("GEMINI_API_KEY");
    }

    private String getStadiumContext() {
        if (stadiumContextCache == null) {
            try {
                ClassPathResource resource = new ClassPathResource("stadium_context.json");
                stadiumContextCache = new String(Files.readAllBytes(resource.getFile().toPath()));
            } catch (Exception e) {
                stadiumContextCache = "{}";
            }
        }
        return stadiumContextCache;
    }

    public String askGemini(String prompt, Map<String, Object> liveTelemetry) {
        try {
            if (apiKey == null || apiKey.trim().isEmpty()) {
                throw new RuntimeException("API Key missing");
            }

            String context = getStadiumContext();
            String fullPrompt = "You are a helpful Sentient Stadium AI assistant.\n" +
                                "Here is the static rules and context: " + context + "\n" +
                                "Here is the real-time gate telemetry (wait times and crowd deltas): " + liveTelemetry + "\n" +
                                "Based on this, answer the user's prompt: " + prompt;

            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("parts", new Object[]{ Map.of("text", fullPrompt) });
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", new Object[]{ contentMap });

            // Using gemini-1.5-pro or gemini-pro. Let's use gemini-1.5-flash for speed or gemini-pro.
            String response = webClient.post()
                    .uri("/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // Blocking for simplicity since we want synchronous return, or parse JSON.

            // Parse response to extract just the text.
            // A crude parser for the JSON response to extract parts[0].text
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> json = mapper.readValue(response, Map.class);
            var candidates = (java.util.List<Map<String, Object>>) json.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                var content = (Map<String, Object>) candidates.get(0).get("content");
                var parts = (java.util.List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
            return "Could not understand the AI response.";

        } catch (Exception e) {
            // Safe-mode degradation
            System.err.println("Gemini API Error: " + e.getMessage());
            return "AI offline, routing active. Please check the venue map manually for crowd levels.";
        }
    }
}
