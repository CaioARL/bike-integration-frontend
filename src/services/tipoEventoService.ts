import type { AxiosResponse } from 'axios';
import type { TipoEvento } from 'src/models/TipoEvento';
import api from 'src/services/axiosService';

export const getTiposEvento = async (): Promise<TipoEvento[]> => {
  try {
    const response: AxiosResponse<TipoEvento[]> = await api.get<TipoEvento[]>('/tipo/evento/', {});
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tipos de evento:', error);
    throw error;
  }
};
