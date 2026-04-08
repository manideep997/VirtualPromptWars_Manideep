package com.sentientstadium;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.net.ServerSocket;
import java.io.IOException;

@SpringBootApplication
public class SentientStadiumApplication {

    public static void main(String[] args) {
        checkGeminiApiKey();
        configurePortFallback();
        SpringApplication.run(SentientStadiumApplication.class, args);
    }

    private static void checkGeminiApiKey() {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            System.err.println("\n========================================================");
            System.err.println("CRITICAL ERROR: GEMINI_API_KEY is missing!");
            System.err.println("Please add your Gemini API Key to the .env file or environment variables.");
            System.err.println("The Sentient Stadium backend requires the AI orchestration to function.");
            System.err.println("========================================================\n");
            System.exit(1);
        }
    }

    private static void configurePortFallback() {
        try (ServerSocket socket = new ServerSocket(8080)) {
            // Port 8080 is available
            System.setProperty("server.port", "8080");
        } catch (IOException e) {
            // Port 8080 is in use, fallback to 8081
            System.out.println("Port 8080 is in use. Falling back to port 8081...");
            System.setProperty("server.port", "8081");
        }
    }
}
