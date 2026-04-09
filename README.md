<div align="center">
  <img src="https://img.icons8.com/color/150/000000/stadium.png" alt="Sentient Stadium Logo"/>
  <h1>🏟️ Sentient Stadium 🏟️</h1>
  <h3>The Ultimate Physical Event Experience Dashboard</h3>

  <p>
    <b>Virtual Prompt Wars Challenge Submission</b>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Java-Spring_Boot-green?style=for-the-badge&logo=spring" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/Next.js-React-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Python-Simulator-blue?style=for-the-badge&logo=python" alt="Python" />
    <img src="https://img.shields.io/badge/AI-Google_Gemini-orange?style=for-the-badge&logo=google" alt="Google Gemini" />
  </p>
</div>

---

## 🌟 Overview

**Sentient Stadium** is an indestructible, real-time venue telemetry platform built to enhance physical event experiences for massive sporting venues. It mitigates crowd bottlenecks, limits wait times, and provides attendees with an **AI-powered concierge** trained on live stadium data.

Built strictly for zero-setup deployments, the platform acts as a resilient matrix handling hardware IoT simulations cleanly.

---

## 🔥 Key Features Matrix

| Phase | Core Component | Implementation Highlights |
| ----- | -------------- | ------------------------- |
| **💡 Phase 1: Infrastructure** | Docker & Fail-Fast | Zero-setup `docker-compose`, programmatic auto-port-fallback (3000 -> 3001), stringent environment checks. |
| **☕ Phase 2: Engine** | Spring Boot API | Ultra-fast H2 In-Memory DB, `@Valid` boundary protections, structured JSON Exception Handlers, Dynamic QR Entry generation. |
| **🐍 Phase 3: Hardware Sync** | Python Simulator | Virtual sensors pumping pseudo-randomized stats with **Moving Average Signal Processing** + Exponential `--halftime` stress tests via STOMP WebSockets. |
| **⚛️ Phase 4: UI Dashboard** | Next.js & Tailwind | 2D dynamic SVG map hooked to `Zustand` global state mutating colors in real-time based on STOMP traffic thresholds. Backoff reconnect built in. |
| **🧠 Phase 5: AI Orchestration** | Google Gemini | Safe-mode degradation wrapper around the Gemini API combining static context files with real transient local state. |

---

## 🚀 Instant Quickstart

*No dependencies required beyond Docker!*

1. **Configure AI:** Create a `.env` file in the `sentient-stadium` folder and provide your Gemini key:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
2. **Boot the Stadium:**
   ```bash
   cd sentient-stadium
   docker-compose up --build
   ```
3. **Engage Sensors:**
   ```bash
   cd sentient-stadium/simulator
   python virtual_sensor.py
   ```

*Checkout the complete documentation inside the `sentient-stadium` subdirectory for more details!*

---
