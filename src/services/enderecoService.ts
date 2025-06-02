import type { AxiosResponse } from 'axios';
import type { EnderecoResponse } from 'src/models/response/EnderecoResponse';
import api from 'src/services/axiosService';

export const getEnderecoByCep = async (cep: string): Promise<EnderecoResponse> => {
  try {
    const response: AxiosResponse<EnderecoResponse> = await api.get<EnderecoResponse>(
      `/endereco/get/by/cep?cep=${cep}`,
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar endereço pelo CEP:', error);
    throw error;
  }
};
