import { Client } from '@stomp/stompjs';
import { useTelemetryStore } from '../store/useTelemetryStore';

let stompClient: Client | null = null;

export const connectWebSocket = () => {
  if (stompClient) return;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  // convert http to ws
  const wsUrl = backendUrl.replace(/^http/, 'ws') + '/ws-stadium';

  stompClient = new Client({
    brokerURL: wsUrl,
    reconnectDelay: 3000,
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
  });

  stompClient.onConnect = (frame) => {
    console.log('Connected: ' + frame);
    stompClient?.subscribe('/topic/telemetry', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body);
        useTelemetryStore.getState().updateGate(data);
      }
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  };

  stompClient.onWebSocketClose = () => {
    console.warn("WebSocket connection dropped. Attempting to reconnect every 3 seconds...");
  };

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
