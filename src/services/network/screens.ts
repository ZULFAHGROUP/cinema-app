/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Screens = {
  allScreens: (page: number, limit: number, cinema_id: string) => {
    return Axios.get(
      `${urls.screen}?page=${page}&limit=${limit}&cinema_id=${cinema_id}`
    );
  },

  createScreen: (data: any) => {
    return Axios.post(urls.screen, data);
  },

  updateScreen: (id: string | number, data: any) => {
    return Axios.patch(`${urls.screen}/${id}`, data);
  },

  deleteScreen: (id: string | number) => {
    return Axios.delete(`${urls.screen}/${id}`);
  },
};

export default Screens;
