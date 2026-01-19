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

const transformResponse = (data: string): ApiResponse | any => {
  let response: ApiResponse | any = data;

  try {
    response = JSON.parse(data);
  } catch (e) {
    // If JSON parsing fails, return the raw data
    console.log(e);
  }

  if (typeof response === "object" && response.status === false) {
    throw new Error(response.message || "An error occurred");
  }

  return response;
};

const Axios: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 120 * 1000,
  // withCredentials: true, // Use `withCredentials` instead of `credentials`
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
        // "ngrok-skip-browser-warning": "true",
    // "Access-Control-Allow-Origin": "*",
  },
  transformResponse: [(data) => transformResponse(data)],
});

Axios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const { jwtToken } = state.accounts.data;

    if (jwtToken) {
           config.headers?.set("Authorization", `Bearer ${jwtToken}`);
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

    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      sessionStorage.removeItem("persist:root");
    }

    return Promise.reject(error);
  }
);

export default Axios;
