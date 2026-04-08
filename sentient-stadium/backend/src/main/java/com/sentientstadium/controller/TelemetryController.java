package com.sentientstadium.controller;

import com.sentientstadium.model.TelemetryRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = "*") // Allow localhost Next.js to access this directly
public class TelemetryController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public ResponseEntity<String> receiveTelemetry(@Valid @RequestBody TelemetryRequest request) {
        // Broadcast the telemetry data to all connected frontend clients
        messagingTemplate.convertAndSend("/topic/telemetry", request);
        return ResponseEntity.ok("Telemetry data broadcasted successfully for gate: " + request.getGateId());
    }
}
