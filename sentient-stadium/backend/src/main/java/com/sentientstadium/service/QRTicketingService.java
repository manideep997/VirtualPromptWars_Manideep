package com.sentientstadium.service;

import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class QRTicketingService {
    
    // In-memory mapping of QR hash to Gate entry validity
    // For Phase 2, mapping QR hashes dynamically.
    private final Map<String, Boolean> activeTickets = new ConcurrentHashMap<>();

    public QRTicketingService() {
        // Pre-fill some from data.sql
        activeTickets.put("dummy-qr-hash-1", true);
        activeTickets.put("dummy-qr-hash-2", true);
    }

    public String generateDynamicTicket() {
        String newQrHash = "QR-" + UUID.randomUUID().toString();
        activeTickets.put(newQrHash, true);
        return newQrHash;
    }

    public boolean validateTicketForEntry(String qrHash) {
        if (activeTickets.containsKey(qrHash) && activeTickets.get(qrHash)) {
            // Invalidate ticket after use (single entry)
            activeTickets.put(qrHash, false);
            return true;
        }
        return false;
    }
}
