import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthRoutes from "./routes/authRoute";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/Layout";
import { allRoutes } from "./routes/allRoutes";
import Dashboard from "./pages/Dashboard";
import CinemaRoutes from "./routes/cinemaRoute";
import MoviesRoutes from "./routes/moviesRoute";
import ConcessionsRoutes from "./routes/concessionsRoute";
import TicketsRoutes from "./routes/ticketsRoute";
import StaffsRoutes from "./routes/staffRoutes";
import CustomersRoutes from "./routes/customersRoutes";
import SchedulingRoutes from "./routes/schedulingRoutes";
import SignageRoutes from "./routes/signageRoute";

const App = () => {
  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <main>
            <ReactNotifications />
            <Routes>
              <Route path="/" element={<Navigate to={allRoutes.dashboard} />} />
              <Route path="/auth/*" element={<AuthRoutes />} />
              <Route element={<AppLayout />}>
                <Route path={allRoutes.dashboard} element={<Dashboard />} />
                <Route
                  path={`${allRoutes.cinema}/*`}
                  element={<CinemaRoutes />}
                />
                <Route
                  path={`${allRoutes.movies}/*`}
                  element={<MoviesRoutes />}
                />
                <Route
                  path={`${allRoutes.tickets}/*`}
                  element={<TicketsRoutes />}
                />
                <Route
                  path={`${allRoutes.staffs}/*`}
                  element={<StaffsRoutes />}
                />
                <Route
                  path={`${allRoutes.concessions}/*`}
                  element={<ConcessionsRoutes />}
                />
                <Route
                  path={`${allRoutes.customers}/*`}
                  element={<CustomersRoutes />}
                />
                <Route
                  path={`${allRoutes.scheduling}/*`}
                  element={<SchedulingRoutes />}
                />
                <Route
                  path={`${allRoutes.signage}/*`}
                  element={<SignageRoutes />}
                />
              </Route>

              {/*  404 Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer
              position="top-right"
              theme="dark"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
            />
          </main>
        </Router>
      </PersistGate>
    </StoreProvider>
  );
};

export default App;
