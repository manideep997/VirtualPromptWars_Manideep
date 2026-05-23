import { NextResponse } from 'next/server';
import { ticketsStore, Ticket } from '../../../lib/ticketStore';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      ticketId, 
      fullName, 
      email, 
      stadium, 
      gate, 
      idType, 
      photoDataUrl, 
      timestamp, 
      gateWaitTime 
    } = data;
    
    if (!ticketId || !fullName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newTicket: Ticket = {
      ticketId,
      fullName,
      email,
      stadium,
      gate,
      idType,
      photoDataUrl,
      timestamp,
      gateWaitTime
    };
    
    ticketsStore.set(ticketId, newTicket);
    console.log(`[TicketStore] Saved ticket: ${ticketId} for ${fullName}`);
    
    return NextResponse.json({ success: true, ticket: newTicket });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');
    
    if (!ticketId) {
      return NextResponse.json({ error: 'Missing ticketId' }, { status: 400 });
    }
    
    const ticket = ticketsStore.get(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    
    return NextResponse.json({ ticket });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
