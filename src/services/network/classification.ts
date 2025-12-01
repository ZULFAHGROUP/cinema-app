/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const MovieClassification = {
  allMovieClassification: (page: number, limit: number) => {
    return Axios.get(`${urls.movie_clas}?page=${page}&limit=${limit}`);
  },

  createMovieClassification: (data: any) => {
    return Axios.post(urls.movie_clas, data);
  },

  updateMovieClassification: (id: string | number, data: any) => {
    return Axios.patch(`${urls.movie_clas}/${id}`, data);
  },

  deleteMovieClassification: (id: string | number) => {
    return Axios.delete(`${urls.movie_clas}/${id}`);
  },
};

export default MovieClassification;
