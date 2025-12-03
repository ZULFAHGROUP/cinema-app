/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Movie = {
  allMovies: (page: number, limit: number) => {
    return Axios.get(
      `${urls.movie}?page=${page}&limit=${limit}                                                                  `
    );
  },

  createMovie: (data: any) => {
    return Axios.post(urls.movie, data);
  },

  updateMovie: (id: string | number, data: any) => {
    return Axios.patch(`${urls.movie}/${id}`, data);
  },

  deleteMovie: (id: string | number) => {
    return Axios.delete(`${urls.movie}/${id}`);
  },
};

export default Movie;
