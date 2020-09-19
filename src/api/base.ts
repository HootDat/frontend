import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/api';
import store from '../utils/store';

const client = axios.create({
  baseURL: process.env.BACKEND_URL,
});

class BaseAPI {
  public get<T = any>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return processRequest(url, client.get(url, { params, ...getConfig() }));
  }

  public post<T = any>(url: string, data: any = {}): Promise<AxiosResponse<T>> {
    return processRequest(url, client.post(url, data, getConfig()));
  }

  public put<T = any>(url: string, data: any = {}): Promise<AxiosResponse<T>> {
    return processRequest(url, client.put(url, data, getConfig()));
  }

  public delete<T = any>(url: string): Promise<AxiosResponse<T>> {
    return processRequest(url, client.delete(url, getConfig()));
  }

  // Methods whereby the data is immediately extracted from the HTTP response.
  public getData<T = any>(url: string, params?: any): Promise<T> {
    return this.get(url, params).then(response => response.data);
  }

  public postData<T = any>(url: string, data: any = {}): Promise<T> {
    return this.post(url, data).then(response => response.data);
  }

  public putData<T = any>(url: string, data: any = {}): Promise<T> {
    return this.put(url, data).then(response => response.data);
  }
}

// attach access token for request if necessary
// TODO fix this to send the actual token instead
function getConfig() {
  return {
    headers: store.getAccessToken(),
  };
}

function processRequest<T>(
  endpoint: string,
  promise: Promise<AxiosResponse<T>>
): Promise<AxiosResponse<T>> {
  return promise.catch((error: AxiosError) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API] ${error.code} ${endpoint} : ${error.message}`);
    }
    throw makeApiErrorResponse(error);
  });
}

// Extracts error message.
function makeApiErrorResponse(error: AxiosError): ApiErrorResponse {
  const code = error.response ? error.response.status : -1;
  if (!error.response || !error.response.data || !error.response.data.errors) {
    return {
      code: code,
      errors: [],
    };
  }

  return {
    code: code,
    errors: error.response.data.errors,
  };
}

const base = new BaseAPI();

export default base;
