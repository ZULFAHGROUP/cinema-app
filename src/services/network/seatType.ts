/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const SeatTypes = {
  allSeatType: () => {
    return Axios.get(urls.seat_types);
  },

  createSeatType: (data: any) => {
    return Axios.post(urls.seat_types, data);
  },

  updateSeatType: (id: string | number, data: any) => {
    return Axios.patch(`${urls.seat_types}/${id}`, data);
  },

  deleteSeatType: (id: string | number) => {
    return Axios.delete(`${urls.seat_types}/${id}`);
  },
};

export default SeatTypes;
