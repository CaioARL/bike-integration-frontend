import type { AxiosResponse } from 'axios';
import type { AuthRequest } from 'src/models/request/AuthRequest';
import type { AuthResponse } from 'src/models/response/AuthResponse';
import api from 'src/services/axiosService';
import { get, remove, set } from 'src/utils/sessionStorageUtils';

export const COOKIE_NAME_ACCESS_TOKEN: string = 'accessToken';
export const COOKIE_NAME_USERNAME: string = 'username';

export const publicUrls: string[] = ['/', '/acesso-negado', '/servico-indisponivel'];

export const setAccessToken = (accessToken: string | null = null): void => {
  if (accessToken) {
    set(COOKIE_NAME_ACCESS_TOKEN, accessToken, true);
    return;
  }
  throw new Error('Ocorreu um erro ao efetuar a autenticação na pasta digital');
};

export const setUsername = (username: string | null = null): void => {
  if (username) {
    set(COOKIE_NAME_USERNAME, username, true);
    return;
  }
  throw new Error('Ocorreu um erro ao efetuar a autenticação na pasta digital');
};

export const getAccessToken = (): string | null => {
  return get(COOKIE_NAME_ACCESS_TOKEN);
};

export const getUsername = (): string | null => {
  return get(COOKIE_NAME_USERNAME);
};

export const logout = (): void => {
  remove(COOKIE_NAME_ACCESS_TOKEN);
  remove(COOKIE_NAME_USERNAME);
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response: AxiosResponse<string> = await api.get<string>(`/login`);
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
  logout(); // Limpa o token de acesso antes de obter um novo
  const response: AxiosResponse<AuthResponse> = await api.post<AuthResponse>(`/login/`, usuario);
  if (response.status === 200 && response.data) {
    setAccessToken(response.data.sessao.token);
    setUsername(response.data.nomeUsuario);
    return;
  }
  throw new Error('Ocorreu um erro ao efetuar a autenticação na pasta digital');
};
