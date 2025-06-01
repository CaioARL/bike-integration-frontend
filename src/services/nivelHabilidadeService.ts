import type { AxiosResponse } from 'axios';
import type { NivelHabilidade } from 'src/models/NivelHabilidade';
import api from 'src/services/axiosService';

export const getNiveisHabilidade = async (): Promise<NivelHabilidade[]> => {
  try {
    const response: AxiosResponse<NivelHabilidade[]> = await api.get<NivelHabilidade[]>(
      '/nivel/habilidade/',
      {},
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar níveis de habilidade:', error);
    throw error;
  }
};
