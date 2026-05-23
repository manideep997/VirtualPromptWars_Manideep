import { create } from 'zustand';

interface TelemetryData {
  gateId: string;
  waitTimeMinutes: number;
  crowdDelta: number;
}

export interface PinPosition {
  top: string;
  left: string;
}

export interface StadiumInfo {
  id: string;
  name: string;
  location: string;
  capacity: number;
  homeTeam: string;
  themeColor: string;
  imagePath: string;
  styleProps: {
    ringColor: string;
    fieldColor: string;
  };
  pinPositions: {
    tunnel: PinPosition;
    gateVip: PinPosition;
    gateA: PinPosition;
    gateB: PinPosition;
    gateC: PinPosition;
    firstAid: PinPosition;
    concessions: PinPosition;
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
    imagePath: "/stadiums/camp-nou.jpg",
    styleProps: { ringColor: "#b91c1c", fieldColor: "#166534" },
    pinPositions: {
      tunnel: { top: "54%", left: "50%" },
      gateVip: { top: "25%", left: "50%" },
      gateA: { top: "60%", left: "15%" },
      gateB: { top: "82%", left: "45%" },
      gateC: { top: "60%", left: "85%" },
      firstAid: { top: "48%", left: "22%" },
      concessions: { top: "35%", left: "75%" }
    }
  },
  {
    id: "wembley",
    name: "Wembley Stadium",
    location: "London, United Kingdom",
    capacity: 90000,
    homeTeam: "England",
    themeColor: "from-slate-400 to-slate-200",
    imagePath: "/stadiums/wembley.jpg",
    styleProps: { ringColor: "#94a3b8", fieldColor: "#16a34a" },
    pinPositions: {
      tunnel: { top: "52%", left: "50%" },
      gateVip: { top: "25%", left: "48%" },
      gateA: { top: "65%", left: "18%" },
      gateB: { top: "80%", left: "52%" },
      gateC: { top: "65%", left: "82%" },
      firstAid: { top: "58%", left: "25%" },
      concessions: { top: "42%", left: "75%" }
    }
  },
  {
    id: "bernabeu",
    name: "Santiago Bernabéu",
    location: "Madrid, Spain",
    capacity: 81044,
    homeTeam: "Real Madrid CF",
    themeColor: "from-[#1e293b] to-[#64748b]",
    imagePath: "/stadiums/bernabeu.png",
    styleProps: { ringColor: "#475569", fieldColor: "#15803d" },
    pinPositions: {
      tunnel: { top: "62%", left: "45%" },
      gateVip: { top: "30%", left: "50%" },
      gateA: { top: "75%", left: "20%" },
      gateB: { top: "85%", left: "60%" },
      gateC: { top: "65%", left: "88%" },
      firstAid: { top: "55%", left: "25%" },
      concessions: { top: "40%", left: "72%" }
    }
  },
  {
    id: "san-siro",
    name: "San Siro",
    location: "Milan, Italy",
    capacity: 80018,
    homeTeam: "AC Milan & Inter Milan",
    themeColor: "from-red-600 to-blue-600",
    imagePath: "/stadiums/san-siro.jpg",
    styleProps: { ringColor: "#854d0e", fieldColor: "#166534" },
    pinPositions: {
      tunnel: { top: "60%", left: "50%" },
      gateVip: { top: "30%", left: "50%" },
      gateA: { top: "72%", left: "20%" },
      gateB: { top: "82%", left: "55%" },
      gateC: { top: "72%", left: "80%" },
      firstAid: { top: "58%", left: "25%" },
      concessions: { top: "45%", left: "75%" }
    }
  },
  {
    id: "allianz",
    name: "Allianz Arena",
    location: "Munich, Germany",
    capacity: 75000,
    homeTeam: "FC Bayern Munich",
    themeColor: "from-red-600 to-red-950",
    imagePath: "/stadiums/allianz.jpg",
    styleProps: { ringColor: "#dc2626", fieldColor: "#15803d" },
    pinPositions: {
      tunnel: { top: "58%", left: "50%" },
      gateVip: { top: "28%", left: "48%" },
      gateA: { top: "70%", left: "18%" },
      gateB: { top: "82%", left: "52%" },
      gateC: { top: "70%", left: "82%" },
      firstAid: { top: "55%", left: "24%" },
      concessions: { top: "40%", left: "76%" }
    }
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
