/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const ScreenTypes = {
  allScreenType: (page: number, limit: number) => {
    return Axios.get(`${urls.screen_types}?page=${page}&limit=${limit}`);
  },

  createScreenType: (data: any) => {
    return Axios.post(urls.screen_types, data);
  },

  updateScreenType: (id: string | number, data: any) => {
    return Axios.patch(`${urls.screen_types}/${id}`, data);
  },

  deleteScreenType: (id: string | number) => {
    return Axios.delete(`${urls.screen_types}/${id}`);
  },
};

export default ScreenTypes;
