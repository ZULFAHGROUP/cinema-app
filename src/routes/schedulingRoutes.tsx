import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { allRoutes } from "./allRoutes";
import SchedulingPage from "../pages/Scheduling";

const SchedulingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SchedulingPage />} />
      <Route
        path="*"
        element={<NotFound route={`${allRoutes.scheduling}/`} />}
      />
    </Routes>
  );
};

export default SchedulingRoutes;
