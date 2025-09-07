import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // const location = useLocation();
  // const account = useSelector((state: RootState) => state.accounts.data);

  // Redirect to login if user is not authenticated
  // if (!account?.jwtToken || account?.sessionTimedOut) {
  //   return <Navigate to="/auth/login" state={{ from: location }} replace />;
  // }

  return <>{children}</>;
};

export default PrivateRoute;
