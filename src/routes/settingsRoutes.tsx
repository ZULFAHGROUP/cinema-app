import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { allRoutes } from "./allRoutes";
import Settings from "../pages/Settings";

const SettingsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Settings />} />
      <Route path="*" element={<NotFound route={`${allRoutes.settings}/`} />} />
    </Routes>
  );
};

export default SettingsRoutes;
