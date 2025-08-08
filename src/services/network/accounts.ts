/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from "../httpClient";
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Accounts = {
  login: (data: any) => {
    return Axios.post(urls.login, data);
  },

  createUser: (data: any) => {
    return Axios.post(urls.createAccount, data);
  },

  resetPassword: (data: any) => {
    return Axios.post(urls.createAccount, data);
  },

  updateProfile: (data: any) => {
    return Axios.post(urls.createAccount, data);
  },

  changePassword: (data: any) => {
    return Axios.post(urls.createAccount, data);
  },
};

export default Accounts;
