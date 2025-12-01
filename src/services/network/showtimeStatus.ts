/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const ShowtimeStatus = {
  allShowtimeStatuses: (page:number, limit:number) => {
    return Axios.get(`${urls.showtime_status}?page=${page}&limit=${limit}`);
  },

  createShowtimeStatus: (data: any) => {
    return Axios.post(urls.showtime_status, data);
  },

  updateShowtimeStatus: (id: string | number, data: any) => {
    return Axios.patch(`${urls.showtime_status}/${id}`, data);
  },

  deleteShowtimeStatus: (id: string | number) => {
    return Axios.delete(`${urls.showtime_status}/${id}`);
  },
};

export default ShowtimeStatus;
