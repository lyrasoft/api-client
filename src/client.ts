import axios, {
  type AxiosError,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from 'axios';
import { parseTemplate } from 'url-template';

export function createApiClient(baseURL: string, options: CreateAxiosDefaults = {}) {
  return axios.create({ baseURL, ...options });
}

export function handleUrlTemplate(config: InternalAxiosRequestConfig) {
  if (config.url && config.vars != null) {
    config.url = parseTemplate(config.url).expand(config.vars);
  }

  return config;
}

export function convertApiMessageToErrorMessage(e: AxiosError<any>) {
  const json = e.response?.data;

  if (json?.message) {
    e.message = json.message;
  }

  return e;
}

declare module 'axios' {

  export interface AxiosRequestConfig {
    _autoAuth?: boolean;
    _isRefresh?: boolean;
    vars?: any;
  }
}
