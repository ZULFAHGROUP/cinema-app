import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { allRoutes } from "./allRoutes";
import CinemaSetup from "../pages/CinemaSetup";

const CinemaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CinemaSetup />} />
      {/* <Route path="create" element={<CreateClaim />} />{" "}
      <Route path="details" element={<ViewClaimsDetails />} />
      <Route path="edit" element={<EditClaim />} /> */}
      <Route path="*" element={<NotFound route={`${allRoutes.cinema}/`} />} />
    </Routes>
  );
};

export default CinemaRoutes;
