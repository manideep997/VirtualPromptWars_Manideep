export interface Ticket {
  ticketId: string;
  fullName: string;
  email: string;
  stadium: {
    id: string;
    name: string;
    location: string;
    capacity: string;
    themeColor: string;
  };
  gate: string;
  idType: string;
  photoDataUrl: string; // Base64 data URI of the uploaded ID image
  timestamp: string;
  gateWaitTime: number;
}

// Ensure the ticket store survives Next.js dev hot reloading
const globalForTickets = global as unknown as {
  tickets: Map<string, Ticket>;
};

if (!globalForTickets.tickets) {
  globalForTickets.tickets = new Map<string, Ticket>();
}

export const ticketsStore = globalForTickets.tickets;
