import type {
  EventoPayload,
  EventoSocketMessageResponse,
} from 'src/models/response/EventoSocketMessageResponse';
import { getAccessToken } from './authService';
import { notifyCustom } from './notifyService';

// Serviço para conexão WebSocket com o backend de eventos
let socket: WebSocket | null = null;
let onMessageCallback: ((msg: EventoSocketMessageResponse<EventoPayload>) => void) | null = null;
const token = getAccessToken();
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

function handleSocketError() {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    setTimeout(() => {
      if (onMessageCallback) {
        connectEventoSocket(onMessageCallback);
      }
    }, 1000 * reconnectAttempts); // backoff
  } else {
    notifyCustom(
      'Não foi possível conectar ao servidor de eventos. Por favor, recarregue a página.',
      'negative',
      'error',
    );
  }
}

export function connectEventoSocket(
  onMessage: (msg: EventoSocketMessageResponse<EventoPayload>) => void,
): void {
  const url = process.env.VUE_APP_API_WS_URL || 'ws://localhost:8080/bike-integration/ws';
  socket = new WebSocket(`${url}?token=${token}`);
  onMessageCallback = onMessage;

  socket.onopen = () => {
    reconnectAttempts = 0;
    console.log('WebSocket conectado');
  };
  socket.onmessage = (event) => {
    try {
      const data: EventoSocketMessageResponse<EventoPayload> = JSON.parse(event.data);
      if (onMessageCallback) onMessageCallback(data);
    } catch (e) {
      console.error('Erro ao processar mensagem do WebSocket:', e);
    }
  };
  socket.onclose = () => {
    console.log('WebSocket desconectado');
    handleSocketError();
  };
  socket.onerror = () => {
    socket?.close();
  };
}

export function disconnectEventoSocket() {
  socket?.close();
  socket = null;
}
