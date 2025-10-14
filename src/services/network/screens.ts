/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Screens = {
  allScreens: () => {
    return Axios.get(urls.screen);
  },

  createScreen: (cinema_id: string | number, data: any) => {
    return Axios.post(`${urls.screen}/${cinema_id}`, data);
  },

  updateScreen: (id: string | number, data: any) => {
    return Axios.patch(`${urls.screen}/${id}`, data);
  },

  deleteScreen: (id: string | number) => {
    return Axios.delete(`${urls.screen}/${id}`);
  },
};

export default Screens;
