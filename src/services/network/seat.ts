import urls from "../../constants/urls";
import Axios from "../httpClient";

export interface SeatLayoutRow {
  row: string;
  seats: number;
  seat_type?: string;
  disabled?: number[];
}

const Seats = {
  /** The screen's seat map, including deactivated seats. */
  getScreenSeats: (screenId: string) => {
    return Axios.get(`${urls.screen}/${screenId}/seats`);
  },

  /** Replaces the layout; seats are matched by label, so re-sending updates in place. */
  saveScreenSeats: (screenId: string, rows: SeatLayoutRow[]) => {
    return Axios.put(`${urls.screen}/${screenId}/seats`, { rows });
  },

  /** Each seat for a showtime with its status: available, held or sold. */
  getShowtimeSeats: (showtimeId: string) => {
    return Axios.get(`${urls.showtime}/${showtimeId}/seats`);
  },
};

export default Seats;
