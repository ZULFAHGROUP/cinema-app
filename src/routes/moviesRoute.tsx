import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { allRoutes } from "./allRoutes";
import MoviesPage from "../pages/Movies";

const MoviesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MoviesPage />} />
      <Route path="*" element={<NotFound route={`${allRoutes.movies}/`} />} />
    </Routes>
  );
};

export default MoviesRoutes;
