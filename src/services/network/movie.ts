/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

export interface MovieFilters {
  search?: string;
  movie_classification_id?: string;
  is_active?: boolean;
}

const Movie = {
  /** Movies plus `stats` (total/active/inactive) over every movie the filters match. */
  allMovies: (page: number, limit: number, filters: MovieFilters = {}) => {
    return Axios.get(urls.movie, { params: { page, limit, ...filters } });
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

  deactivateMovie: (id: string | number) => {
    return Axios.patch(`${urls.movie_deactivate}/${id}`);
  },

  uploadPoster: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return Axios.post(urls.upload, formData, { params: { type: "movie" } });
  },
};

export default Movie;
