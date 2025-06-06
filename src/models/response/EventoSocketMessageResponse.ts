export interface EventoPayload {
  type: string;
  payload: string;
}

export interface EventoSocketMessageResponse<T> {
  action: string;
  message?: string;
  data?: T;
  timestamp: string;
  userId?: string;
}
