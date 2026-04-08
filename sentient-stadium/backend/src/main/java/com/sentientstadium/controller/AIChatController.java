package com.sentientstadium.controller;

import com.sentientstadium.model.ChatRequest;
import com.sentientstadium.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class AIChatController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody ChatRequest request) {
        String answer = geminiService.askGemini(request.getPrompt(), request.getLiveTelemetry());
        return ResponseEntity.ok(answer);
    }
}
