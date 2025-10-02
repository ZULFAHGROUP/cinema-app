import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { allRoutes } from "./allRoutes";
import StaffPage from "../pages/Staffs";

const StaffsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StaffPage />} />
      <Route path="*" element={<NotFound route={`${allRoutes.staffs}/`} />} />
    </Routes>
  );
};

export default StaffsRoutes;
