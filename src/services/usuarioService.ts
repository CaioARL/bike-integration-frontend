import type { AxiosResponse } from 'axios';
import type { Usuario } from 'src/models/Usuario';
import api from 'src/services/axiosService';

export const getUsuariosByName = async (name: string): Promise<Usuario[]> => {
  try {
    const response: AxiosResponse<Usuario[]> = await api.get(
      `/usuario/search?name=${encodeURIComponent(name)}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching usuarios by name:', error);
    throw error;
  }
};
