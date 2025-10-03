import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { allRoutes } from "./allRoutes";
import SignagePage from "../pages/DigitalSignage";

const SignageRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SignagePage />} />
      <Route path="*" element={<NotFound route={`${allRoutes.signage}/`} />} />
    </Routes>
  );
};

export default SignageRoutes;
