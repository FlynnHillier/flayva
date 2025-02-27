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
    return Promise.reject(error.response?.data);
  };

  const onSuccess = (response: AxiosResponse) => {
    return response;
  };

  return client.request(config).then(onSuccess).catch(onError);
};
