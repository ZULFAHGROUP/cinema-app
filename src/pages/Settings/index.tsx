import { useState } from "react";
import Button from "../../components/shared/Button";
import MovieClassification from "./components/MovieClassification";
import SeatType from "./components/SeatType";
import ShowtimeStatus from "./components/ShowtimeStatus";
import Roles from "./components/Roles";
import ProductCategory from "./components/ProductCategory";
import PriceRule from "./components/PriceRule";
import Permissions from "./components/Permissions";
import VATConfig from "./components/VATConfig";
import RolePermissions from "./components/RolePermissions";

const Settings = () => {
  type SettingsNav =
    | "movie-classification"
    | "screen-type"
    | "showtime-status"
    | "roles"
    | "product-category"
    | "price-rule"
    | "permissions"
    | "vat-config"
    | "role-permission";

  const [currentScreen, setCurrentScreen] = useState<SettingsNav>(
    "movie-classification"
  );
  interface SettingsRouteProps {
    name: string;
    url: SettingsNav;
  }
  const settingsRoute: SettingsRouteProps[] = [
    { name: "Movie Classification", url: "movie-classification" },
    { name: "Screen Type", url: "screen-type" },
    { name: "Showtime Status", url: "showtime-status" },
    { name: "Roles", url: "roles" },
    { name: "Product Category", url: "product-category" },
    { name: "Price Rule", url: "price-rule" },
    { name: "Permissions", url: "permissions" },
    { name: "VAT Config", url: "vat-config" },
    { name: "Role Permission", url: "role-permission" },
  ];
  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-2">
      <div className="flex flex-row flex-wrap md:flex-col gap-4 md:gap-1 w-full md:w-[20%]">
        {settingsRoute.map((routes) => (
          <Button
            key={routes.url}
            className="rounded- border-0 rounded-md"
            variant={currentScreen === routes.url ? "primary" : "outline"}
            onClick={() => setCurrentScreen(routes.url)}
            title={routes.name}
          />
        ))}
      </div>
      <div className="md:border-l md:border-l- md:px-2 w-full md:w-[80%]">
        {currentScreen === "movie-classification" ? (
          <MovieClassification />
        ) : currentScreen === "screen-type" ? (
          <SeatType />
        ) : currentScreen === "showtime-status" ? (
          <ShowtimeStatus />
        ) : currentScreen === "roles" ? (
          <Roles />
        ) : currentScreen === "product-category" ? (
          <ProductCategory />
        ) : currentScreen === "price-rule" ? (
            <PriceRule />
        ) : currentScreen === "permissions" ? (
            <Permissions />
        ) : currentScreen === "vat-config" ? (
            <VATConfig />
        ) : (
          <RolePermissions />
        )}
      </div>
    </div>
  );
};

export default Settings;
