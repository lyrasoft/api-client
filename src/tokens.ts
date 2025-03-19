import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

export function autoInjectAccessToken<V = any>(
  config: InternalAxiosRequestConfig<V>,
  accessToken: string,
) {
  config.headers = config.headers || {};
  config._autoAuth ??= true;

  if (config._autoAuth) {
    if (!config.headers.Authorization) {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  }

  return config;
}

export async function autoRefreshTokens(
  e: AxiosError<any>,
  errorCode: number | string | ((e: any) => boolean | Promise<boolean>),
  refreshHandler: () => string | Promise<string>,
) {
  let shouldRefresh: boolean;

  if (typeof errorCode === 'function') {
    shouldRefresh = await errorCode(e);
  } else {
    shouldRefresh = errorCode === (e.response?.data?.code ?? 0);
  }

  if (shouldRefresh) {
    const originalRequest = e.config;

    if (originalRequest && !originalRequest._isRefresh) {
      const newAccessToken = await refreshHandler();

      return retry(originalRequest, newAccessToken);
    }
  }
}

export async function retry(
  originalRequest: AxiosRequestConfig,
  newAccessToken: string,
) {
  originalRequest._isRefresh = true;

  originalRequest.headers = originalRequest.headers || {};
  originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
  return axios(originalRequest);
}

export function getErrorCode(e: AxiosError<any>) {
  return e.response?.data?.code;
}

export class AccessTokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccessTokenExpiredError';
  }
}

export class RefreshTokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RefreshTokenExpiredError';
  }
}
