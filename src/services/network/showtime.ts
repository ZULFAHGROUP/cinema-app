/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const ShowTime = {
  allShowtimes: () => {
    return Axios.get(urls.showtime);
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
