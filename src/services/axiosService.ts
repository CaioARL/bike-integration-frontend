/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import axios from 'axios';
import { getAccessToken, isPublicUrl, logout } from 'src/services/authService';

export const baseUrl: string | undefined = process.env.VUE_APP_API_URL;
if (!baseUrl) {
  window.location.href = '/servico-indisponivel';
  throw new Error('VUE_APP_API_URL not defined on env');
}

const api = axios.create({
  baseURL: `${baseUrl}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken: string | null = getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      config.headers['X-Access-Key'] = process.env.VUE_APP_API_X_ACCESS_KEY;
    }
    console.debug('Axios request config: ', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error on axios response: ', error);

    if (error && error.code && error.code === 'ERR_NETWORK') {
      window.location.href = '/servico-indisponivel';
      return Promise.resolve();
    }

    if (error && error.response) {
      if (!isPublicUrl()) {
        if (error.response.status === 403 && !window.location.href.endsWith('/acesso-negado')) {
          window.location.href = '/acesso-negado';
          logout();
          return Promise.resolve();
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
