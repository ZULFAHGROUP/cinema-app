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

  updateProfile: (data: {
    surname?: string;
    other_names?: string;
    phone?: string;
    profile_temp_upload_id?: string;
  }) => {
    return Axios.patch(urls.me, data);
  },

  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return Axios.post(urls.upload, formData, { params: { type: "profile" } });
  },

  switchContext: (cinema_id: string) => {
    return Axios.post(urls.switch_context, { cinema_id });
  },

  exitSwitchContext: () => {
    return Axios.post(urls.exit_switch_context);
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
