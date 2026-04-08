import argparse
import random
import time
import requests

BACKEND_URL = "http://localhost:8080/api/telemetry"

class MovingAverageFilter:
    def __init__(self, window_size=5):
        self.window_size = window_size
        self.values = []

    def next(self, new_val):
        self.values.append(new_val)
        if len(self.values) > self.window_size:
            self.values.pop(0)
        return sum(self.values) / len(self.values)

def run_simulation(halftime=False):
    print("=========================================")
    print("🏟️ Sentient Stadium - Virtual Sensor Node")
    if halftime:
        print("⚠️ HALFTIME RUSH MODE ACTIVATED!")
    print("=========================================\n")

    # We track a few gates for our simulation
    gates = ["Gate A", "Gate B", "Gate C", "Gate VIP"]
    filters = {gate: MovingAverageFilter(window_size=3) for gate in gates}
    crowd_filters = {gate: MovingAverageFilter(window_size=4) for gate in gates}

    multiplier = 5 if halftime else 1

    try:
        while True:
            for gate in gates:
                # Raw random inputs
                raw_wait = random.randint(1 * multiplier, 10 * multiplier)
                raw_crowd = random.randint(5 * multiplier, 50 * multiplier)

                # Applying moving average logic so data trends smoothly
                smoothed_wait = int(filters[gate].next(raw_wait))
                smoothed_crowd = int(crowd_filters[gate].next(raw_crowd))

                payload = {
                    "gateId": gate,
                    "waitTimeMinutes": smoothed_wait,
                    "crowdDelta": smoothed_crowd
                }

                try:
                    res = requests.post(BACKEND_URL, json=payload)
                    print(f"📡 Sent telemetry for {gate}: Wait={smoothed_wait}m, Crowd={smoothed_crowd} -> Status: {res.status_code}")
                except requests.exceptions.RequestException as e:
                    print(f"❌ Connection failed: {e}")
            
            time.sleep(2)
    except KeyboardInterrupt:
        print("\nStopping simulation.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the Sentient Stadium Virtual Sensor")
    parser.add_argument('--halftime', action='store_true', help="Instantly multiply synthetic crowd numbers to simulate halftime rush.")
    args = parser.parse_args()

    run_simulation(halftime=args.halftime)
