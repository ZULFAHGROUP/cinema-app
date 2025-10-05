import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { allRoutes } from "./allRoutes";
import ReportsPage from "../pages/Reports";

const ReportsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ReportsPage />} />
      <Route path="*" element={<NotFound route={`${allRoutes.reports}/`} />} />
    </Routes>
  );
};

export default ReportsRoutes;
