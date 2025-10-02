import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { allRoutes } from "./allRoutes";
import TicketSalesPage from "../pages/Tickets";

const TicketsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TicketSalesPage />} />
      <Route path="*" element={<NotFound route={`${allRoutes.tickets}/`} />} />
    </Routes>
  );
};

export default TicketsRoutes;
