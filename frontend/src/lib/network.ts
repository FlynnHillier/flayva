import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export class NetworkResourceNotFoundError extends Error {
  constructor(message: string = "Resource not found") {
    super(message);
  }
}

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
    if (error.status === 404) {
      const { message } = error.response?.data as { message?: string };

      return Promise.reject(new NetworkResourceNotFoundError(message));
    }

    return Promise.reject(error);
  };

  const onSuccess = (response: AxiosResponse) => {
    return response;
  };

  return client.request(config).then(onSuccess).catch(onError);
};
