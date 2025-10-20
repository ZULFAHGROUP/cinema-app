/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Seats = {
  allSeat: () => {
    return Axios.get(urls.seat);
  },

  createSeat: (data: any) => {
    return Axios.post(urls.seat, data);
  },

  updateSeat: (id: string | number, data: any) => {
    return Axios.patch(`${urls.seat}/${id}`, data);
  },

  deleteSeat: (id: string | number) => {
    return Axios.delete(`${urls.seat}/${id}`);
  },
};

export default Seats;
