import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import sideBarDetails from "../constants/sidebar";
import { hasAnyPermission } from "../utils/permissions";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const account = useSelector((state: RootState) => state.accounts.data);

  // Redirect to login if user is not authenticated
  if (!account?.jwtToken || account?.sessionTimedOut) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if current route requires permissions that the signed-in staff lacks
  const matchedNav = sideBarDetails.find(
    (item) =>
      item.key !== "/dashboard" &&
      (location.pathname === item.key || location.pathname.startsWith(`${item.key}/`))
  );

  if (
    matchedNav?.permissions?.length &&
    !hasAnyPermission(account?.user, matchedNav.permissions)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
