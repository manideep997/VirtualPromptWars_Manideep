import { NextResponse } from 'next/server';
import os from 'os';

export async function GET(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const port = host.split(':')[1] || '3000';
  
  let localIp = 'localhost';
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      // Find IPv4 address that is not loopback
      if (net.family === 'IPv4' && !net.internal) {
        localIp = net.address;
        break;
      }
    }
    if (localIp !== 'localhost') break;
  }
  
  return NextResponse.json({ 
    ip: localIp, 
    port, 
    fullAddress: `${localIp}:${port}` 
  });
}
