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
  gates: {},
  updateGate: (data) => set((state) => ({
    gates: {
      ...state.gates,
      [data.gateId]: data
    }
  }))
}));
