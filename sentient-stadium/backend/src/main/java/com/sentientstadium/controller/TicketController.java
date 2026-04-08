package com.sentientstadium.controller;

import com.sentientstadium.service.QRTicketingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private QRTicketingService ticketService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateTicket() {
        return ResponseEntity.ok(ticketService.generateDynamicTicket());
    }

    @PostMapping("/validate/{qrHash}")
    public ResponseEntity<String> validateTicket(@PathVariable String qrHash) {
        boolean isValid = ticketService.validateTicketForEntry(qrHash);
        if (isValid) {
            return ResponseEntity.ok("Valid ticket. Entry authorized.");
        } else {
            return ResponseEntity.status(403).body("Invalid or already used ticket. Entry denied.");
        }
    }
}
