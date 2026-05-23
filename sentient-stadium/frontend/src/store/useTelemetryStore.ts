import { create } from 'zustand';

interface TelemetryData {
  gateId: string;
  waitTimeMinutes: number;
  crowdDelta: number;
}

interface TelemetryStore {
  gates: Record<string, TelemetryData>;
  updateGate: (data: TelemetryData) => void;
}

export const useTelemetryStore = create<TelemetryStore>((set) => ({
  gates: {
    "Gate A": { gateId: "Gate A", waitTimeMinutes: 2, crowdDelta: 8 },
    "Gate B": { gateId: "Gate B", waitTimeMinutes: 4, crowdDelta: 12 },
    "Gate C": { gateId: "Gate C", waitTimeMinutes: 3, crowdDelta: 10 },
    "Gate VIP": { gateId: "Gate VIP", waitTimeMinutes: 1, crowdDelta: 3 }
  },
  updateGate: (data) => set((state) => ({
    gates: {
      ...state.gates,
      [data.gateId]: data
    }
  }))
}));
