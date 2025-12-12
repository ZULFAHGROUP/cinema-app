/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const ShowTime = {
  allShowtimes: (page: number, limit: number, cinema_id?: string) => {
    const url = cinema_id
      ? `${urls.showtime}?page=${page}&limit=${limit}&cinema_id=${cinema_id}`
      : `${urls.showtime}?page=${page}&limit=${limit}`;
    return Axios.get(url);
  },

  singleShowtime: (id: string | number) => {
    return Axios.get(`${urls.showtime}/${id}`);
  },

  createShowtime: (data: any) => {
    return Axios.post(urls.showtime, data);
  },

  updateShowtime: (id: string | number, data: any) => {
    return Axios.patch(`${urls.showtime}/${id}`, data);
  },

  deleteShowtime: (id: string | number) => {
    return Axios.delete(`${urls.showtime}/${id}`);
  },
};

export default ShowTime;
