import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/authRoute";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/Layout";

const App = () => {
  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <main>
            <ReactNotifications />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/*" element={<AuthRoutes />} />
              <Route element={<AppLayout />}></Route>

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
