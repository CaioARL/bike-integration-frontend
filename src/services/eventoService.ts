import type { AxiosResponse } from 'axios';
import type { EventoRequest } from 'src/models/request/EventoRequest';
import type { EventoResponse } from 'src/models/response/EventoResponse';
import api from 'src/services/axiosService';

export const getEventos = async (request: EventoRequest): Promise<EventoResponse> => {
  try {
    const response: AxiosResponse<EventoResponse> = await api.get<EventoResponse>('/evento/', {
      params: request,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    throw error;
  }
};

export const aprovarEvento = async (id: number, aprovar: boolean): Promise<void> => {
  try {
    await api.put(`/evento/${id}/${aprovar}`);
  } catch (error) {
    console.error('Erro ao aprovar evento:', error);
    throw error;
  }
};

export const excluirEvento = async (id: number): Promise<void> => {
  try {
    await api.delete(`/evento/${id}`);
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    throw error;
  }
};
