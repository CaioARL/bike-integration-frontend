import type { AxiosResponse } from 'axios';
import type { Evento } from 'src/models/Evento';
import type { EventoRequest } from 'src/models/request/EventoRequest';
import type { EventoResponse } from 'src/models/response/EventoResponse';
import type { EventoFormData } from 'src/models/request/EventoFormData';
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

export const criarEvento = async (evento: EventoFormData): Promise<Evento> => {
  try {
    const response: AxiosResponse<Evento> = await api.post<Evento>('/evento/', evento);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    throw error;
  }
};

export const atualizarEvento = async (id: number, evento: EventoFormData): Promise<Evento> => {
  try {
    const response: AxiosResponse<Evento> = await api.put<Evento>(`/evento/${id}`, evento);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    throw error;
  }
};
