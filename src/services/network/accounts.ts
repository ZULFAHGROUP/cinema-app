/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig } from "axios";
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Accounts = {
  login: (data: any) => {
    return Axios.post(urls.login, data);
  },

  logout: () => {
    return Axios.post(urls.logout);
  },

  getProfile: (config?: AxiosRequestConfig) => {
    return Axios.get(urls.me, config);
  },

  startForgetPassword: (data: { email: string }) => {
    return Axios.post(urls.start_forget_password, data);
  },

  completeForgetPassword: (data: {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
  }) => {
    return Axios.post(urls.complete_forget_password, data);
  },
};

export default Accounts;
