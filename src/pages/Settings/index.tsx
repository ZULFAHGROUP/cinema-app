import { useEffect, useState } from "react";
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
import { useAppSelector } from "../../store/hook";
import { hasAnyPermission } from "../../utils/permissions";

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

  const { user } = useAppSelector((state) => state.accounts.data);

  interface SettingsRouteProps {
    name: string;
    url: SettingsNav;
    permissions: string[];
  }
  const allSettingsRoutes: SettingsRouteProps[] = [
    { name: "Movie Classification", url: "movie-classification", permissions: ["setup_movie_classification"] },
    { name: "Screen Type", url: "screen-type", permissions: ["setup_screen_type"] },
    { name: "Showtime Status", url: "showtime-status", permissions: ["setup_showtime_status"] },
    { name: "Roles", url: "roles", permissions: ["assign_roles"] },
    { name: "Product Category", url: "product-category", permissions: ["manage_product_categories"] },
    { name: "Price Rule", url: "price-rule", permissions: ["manage_price_rules"] },
    { name: "Permissions", url: "permissions", permissions: ["view_role_permissions", "assign_permissions"] },
    { name: "VAT Config", url: "vat-config", permissions: ["manage_vat_config"] },
    { name: "Role Permission", url: "role-permission", permissions: ["view_role_permissions", "assign_permissions"] },
  ];

  const settingsRoute = allSettingsRoutes.filter((r) => hasAnyPermission(user, r.permissions));

  const [currentScreen, setCurrentScreen] = useState<SettingsNav>(
    settingsRoute[0]?.url || "price-rule"
  );

  useEffect(() => {
    if (settingsRoute.length > 0 && !settingsRoute.some((r) => r.url === currentScreen)) {
      setCurrentScreen(settingsRoute[0].url);
    }
  }, [settingsRoute, currentScreen]);
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
