import { create } from 'zustand';

interface TelemetryData {
  gateId: string;
  waitTimeMinutes: number;
  crowdDelta: number;
}

export interface StadiumInfo {
  id: string;
  name: string;
  location: string;
  capacity: number;
  homeTeam: string;
  themeColor: string;
  styleProps: {
    ringColor: string;
    fieldColor: string;
  };
}

export const STADIUMS: StadiumInfo[] = [
  {
    id: "camp-nou",
    name: "Spotify Camp Nou",
    location: "Barcelona, Spain",
    capacity: 99354,
    homeTeam: "FC Barcelona",
    themeColor: "from-blue-600 to-red-600",
    styleProps: { ringColor: "#b91c1c", fieldColor: "#166534" }
  },
  {
    id: "wembley",
    name: "Wembley Stadium",
    location: "London, United Kingdom",
    capacity: 90000,
    homeTeam: "England",
    themeColor: "from-slate-400 to-slate-200",
    styleProps: { ringColor: "#94a3b8", fieldColor: "#16a34a" }
  },
  {
    id: "bernabeu",
    name: "Santiago Bernabéu",
    location: "Madrid, Spain",
    capacity: 81044,
    homeTeam: "Real Madrid CF",
    themeColor: "from-[#1e293b] to-[#64748b]",
    styleProps: { ringColor: "#475569", fieldColor: "#15803d" }
  },
  {
    id: "san-siro",
    name: "San Siro",
    location: "Milan, Italy",
    capacity: 80018,
    homeTeam: "AC Milan & Inter Milan",
    themeColor: "from-red-600 to-blue-600",
    styleProps: { ringColor: "#854d0e", fieldColor: "#166534" }
  },
  {
    id: "allianz",
    name: "Allianz Arena",
    location: "Munich, Germany",
    capacity: 75000,
    homeTeam: "FC Bayern Munich",
    themeColor: "from-red-600 to-red-950",
    styleProps: { ringColor: "#dc2626", fieldColor: "#15803d" }
  }
];

interface TelemetryStore {
  gates: Record<string, TelemetryData>;
  updateGate: (data: TelemetryData) => void;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  simulationMode: 'normal' | 'halftime' | 'evac';
  setSimulationMode: (mode: 'normal' | 'halftime' | 'evac') => void;
  activeTab: 'benefits' | 'architecture' | 'faqs';
  setActiveTab: (tab: 'benefits' | 'architecture' | 'faqs') => void;
  selectedStadium: StadiumInfo;
  setSelectedStadium: (stadium: StadiumInfo) => void;
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
  })),
  isSimulating: true,
  setIsSimulating: (val) => set({ isSimulating: val }),
  simulationMode: 'normal',
  setSimulationMode: (mode) => set({ simulationMode: mode }),
  activeTab: 'benefits',
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedStadium: STADIUMS[0], // default Spotify Camp Nou
  setSelectedStadium: (stadium) => set({ selectedStadium: stadium })
}));
