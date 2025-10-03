import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { allRoutes } from "./allRoutes";
import CustomersPage from "../pages/Customers";

const CustomersRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomersPage />} />
      <Route
        path="*"
        element={<NotFound route={`${allRoutes.customers}/`} />}
      />
    </Routes>
  );
};

export default CustomersRoutes;
