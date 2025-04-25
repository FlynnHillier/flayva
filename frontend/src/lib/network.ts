import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Axios client to make requests to the server
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_SERVER_ORIGIN as string,
  withCredentials: true,
});

/**
 * Wrapper around axios to make requests to the server
 * @param config Axios request configuration
 * @returns Promise<any>
 */
export const request = async (config: AxiosRequestConfig) => {
  const onError = (error: AxiosError) => {
    return Promise.reject(error);
  };

  const onSuccess = (response: AxiosResponse) => {
    return response;
  };

  return client.request(config).then(onSuccess).catch(onError);
};

export const is404Error = (error: unknown): boolean =>
  error instanceof AxiosError && error.response?.status === 404;

/**
 * Constructs a full URL from a path and the server origin
 * @param path The path to append to the server origin
 * @returns The full URL as a string
 */
export const serverOriginUrl = (path: string) =>
  new URL(path, import.meta.env.VITE_SERVER_ORIGIN).toString();
