import type { Evento } from 'src/models/Evento';

export interface EventoResponse {
  eventos: Evento[];
  totalRegistros: number;
  totalPaginas: number;
}
