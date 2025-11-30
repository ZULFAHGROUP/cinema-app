/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Cinema = {
  allCinemas: (page: number, limit: number) => {
    return Axios.get(`${urls.cinema}?page=${page}&limit=${limit}`);
  },

  createCinema: (data: any) => {
    return Axios.post(urls.cinema, data);
  },

  updateCinema: (id: string | number, data: any) => {
    return Axios.patch(`${urls.cinema}/${id}`, data);
  },

  deleteCinema: (id: string | number) => {
    return Axios.delete(`${urls.cinema}/${id}`);
  },
};

export default Cinema;
