import type { AxiosResponse } from 'axios';
import type { AuthRequest } from 'src/models/request/AuthRequest';
import type { Usuario } from 'src/models/Usuario';
import api from 'src/services/axiosService';
import { get, remove, set } from 'src/utils/localStorageUtils';

export const STORAGE_NAME_ACCESS_TOKEN: string = 'accessToken';
export const STORAGE_NAME_USERNAME: string = 'username';
export const STORAGE_ID_USER: string = 'idUser';

export const publicUrls: string[] = ['/', '/acesso-negado', '/servico-indisponivel'];

export const setAccessToken = (accessToken: string | null = null): void => {
  if (accessToken) {
    set(STORAGE_NAME_ACCESS_TOKEN, accessToken);
    return;
  }
  throw new Error('Ocorreu um erro ao efetuar a autenticação');
};

export const setUsername = (username: string | null = null): void => {
  if (username) {
    set(STORAGE_NAME_USERNAME, username);
    return;
  }
  throw new Error('Ocorreu um erro ao efetuar a autenticação');
};

export const setIdUser = (idUser: string | null = null): void => {
  if (idUser !== null) {
    set(STORAGE_ID_USER, idUser);
    return;
  }
  throw new Error('Ocorreu um erro ao efetuar a autenticação');
};

export const getAccessToken = (): string | null => {
  return get(STORAGE_NAME_ACCESS_TOKEN);
};

export const getUsername = (): string | null => {
  return get(STORAGE_NAME_USERNAME);
};

export const getIdUser = (): string | null => {
  return get(STORAGE_ID_USER);
};

export const logout = (): void => {
  remove(STORAGE_NAME_ACCESS_TOKEN);
  remove(STORAGE_NAME_USERNAME);
  remove(STORAGE_ID_USER);
  remove('eventoListState');
  remove('eventoListExpanded');
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response: AxiosResponse<string> = await api.get<string>(`/login/`);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};

export const isPublicUrl = (): boolean => {
  const currentPathname = window.location.pathname;
  for (const publicUrl of publicUrls) {
    if (currentPathname === publicUrl) {
      return true;
    }
  }
  return false;
};

export const getBikeAccessToken = async (usuario: AuthRequest): Promise<void> => {
  try {
    logout(); // Limpa o token de acesso antes de obter um novo
    const response: AxiosResponse<Usuario> = await api.post<Usuario>(`/login/`, usuario);
    if (response.status === 200 && response.data) {
      if (response.data.role !== 'ADMIN') {
        window.location.href = '/acesso-negado';
        return;
      }
      setAccessToken(response.data.sessao.token);
      setUsername(response.data.nomeUsuario);
      setIdUser(String(response.data.id));
    }
  } catch (error) {
    console.error('Erro ao obter o token de acesso:', error);
    throw new Error('Ocorreu um erro ao efetuar a autenticação');
  }
};
