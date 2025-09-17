import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { allRoutes } from "./allRoutes";
import Concessions from "../pages/Concessions";

const ConcessionsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Concessions />} />
      <Route
        path="*"
        element={<NotFound route={`${allRoutes.concessions}/`} />}
      />
    </Routes>
  );
};

export default ConcessionsRoutes;
