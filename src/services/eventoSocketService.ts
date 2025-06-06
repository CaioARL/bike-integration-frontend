import { getAccessToken } from './authService';

// Serviço para conexão WebSocket com o backend de eventos
let socket: WebSocket | null = null;
let onMessageCallback: ((msg: string) => void) | null = null;
const token = getAccessToken();

export function connectEventoSocket(onMessage: (msg: string) => void) {
  const url = process.env.VUE_APP_API_WS_URL || 'ws://localhost:8080/bike-integration/ws';
  socket = new WebSocket(`${url}?token=${token}`);
  onMessageCallback = onMessage;

  socket.onopen = () => {
    console.log('WebSocket conectado');
  };
  socket.onmessage = (event) => {
    if (onMessageCallback) onMessageCallback(event.data);
  };
  socket.onclose = () => {
    console.log('WebSocket desconectado');
  };
  socket.onerror = () => {
    socket?.close();
  };
}

export function disconnectEventoSocket() {
  socket?.close();
  socket = null;
}
