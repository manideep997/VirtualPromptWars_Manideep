# Sentient Stadium 🏟️

Welcome to **Sentient Stadium**, a physical event experience dashboard that aggregates live venue telemetry, maps it to a 2D interactive layout, and provides an AI-powered concierge using Google's Gemini.

## Indestructible Architecture

This repository is designed specifically to run perfectly on your system with **zero setup**. 
- The **Spring Boot Backend** operates an ultra-fast in-memory H2 database.
- The **Next.js Frontend** offers automatic port fallback (3000 -> 3001) preventing collisions.
- The **Fail-Fast Engine** proactively verifies missing configurations.

## 🚀 3-Step Quickstart Guide

**Prerequisite:** Ensure Docker Desktop is running and you have Java/Python for local execution if not using docker.

### Step 1: Add your AI Brain 🧠
Create a `.env` file at the root of the project `sentient-stadium/.env` and insert your API key:
```env
GEMINI_API_KEY=your_key_here
```

### Step 2: Boot the Matrix 🏗️
Run the entire frontend & backend stack using Docker Compose:
```bash
docker-compose up --build
```
> [!NOTE]
> *The frontend will be available at `http://localhost:3000` (or `3001` if `3000` is taken).*
> *The backend will run on `http://localhost:8080` (or `8081` if `8080` is taken).*

### Step 3: Spark the World (Virtual Sensors) ⚡
Open a new terminal and run the hardware telemetry simulator. This script continuously drives real-time, pseudo-random moving-average data to the dashboard map.
```bash
cd simulator
python3 virtual_sensor.py
```

---

## 🌪️ Triggering the Halftime Rush

Reviewers can trigger a massive surge in crowd metrics at any time to test the system's resilience.

Stop the `virtual_sensor.py` script (`Ctrl+C`), and restart it with the halftime flag to instantly multiply crowd variables across all gates:

```bash
python3 virtual_sensor.py --halftime
```

*Watch the dashboard map dynamically shift gates into the red Danger Zone as simulated panic ensues!*

---

## Technical Features Implemented

1. **Phase 1: Infrastructure**: Robust Dockerization, port-fallback (`next.config` & `server.js` | Spring WebServerFactory config), `.env` fail-fast verifications.
2. **Phase 2: Backend**: In-memory H2, Strict DTO validations (`@Valid`), Global JSON Exception handling, QR ticket UUID generator.
3. **Phase 3: Telemetry Stream**: WebSocket Broadcaster via STOMP, Python virtual sensor.
4. **Phase 4: Dashboard**: Next.js & Tailwind, Zustand global state, 2D SVG map dynamic color binding, resilient WebSocket reconnectivity.
5. **Phase 5: AI Orchestration**: Google Gemini integration answering questions based on static JSON rules + live transient venue data, with *safe-mode degradation*.
