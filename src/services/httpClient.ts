/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import store from "../store/store";
import { logout } from "../store/slices/accounts";
import { ApiResponse } from "../@types/common";
import { toast } from "react-toastify";
import { cleanEmptyStrings } from "../utils";

const transformResponse = (data: string): ApiResponse | any => {
  let response: ApiResponse | any = data;

  try {
    response = JSON.parse(data);
  } catch {
    // Not JSON: return the raw data
  }

  // Errors ({ status: false }) are rejected by the response interceptor, which
  // keeps error.response intact (status code, message) for callers.
  return response;
};

/** A key for one user action; reuse it when retrying that same action. */
export const newIdempotencyKey = (): string => crypto.randomUUID();

/** Config for endpoints that require an Idempotency-Key header. */
export const withIdempotencyKey = (key: string = newIdempotencyKey()) => ({
  headers: { "Idempotency-Key": key },
});

const Axios: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 120 * 1000,
  // withCredentials: true, // Use `withCredentials` instead of `credentials`
  headers: {
    "X-Requested-With": "XMLHttpRequest",
   },
  transformResponse: [(data) => transformResponse(data)],
});

Axios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const { jwtToken } = state.accounts.data;

    if (jwtToken && !config.headers?.has("Authorization")) {
      config.headers?.set("Authorization", `Bearer ${jwtToken}`);
    }

    // Clean empty strings from request data if it's an object
    if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
      config.data = cleanEmptyStrings(config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    toast.error("Unauthorized access");
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    if (response.data.status === false) {
      return Promise.reject(response);
    }

    // The API returns { status, message, data }; callers check `code` for the HTTP status.
    if (response.data && typeof response.data === "object") {
      response.data.code = response.status;
    }

    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    // Surface the API's message ("Invalid Email and/or Password") instead of axios's generic one.
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    if (error.response?.status === 401) {
      store.dispatch(logout());
      sessionStorage.removeItem("persist:root");
    }

    return Promise.reject(error);
  }
);

export default Axios;
