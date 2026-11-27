import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
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
    {
      name: "Movie Classification",
      url: "movie-classification",
      permissions: ["setup_movie_classification"],
    },
    {
      name: "Screen Type",
      url: "screen-type",
      permissions: ["setup_screen_type"],
    },
    {
      name: "Showtime Status",
      url: "showtime-status",
      permissions: ["setup_showtime_status"],
    },
    { name: "Roles", url: "roles", permissions: ["assign_roles"] },
    {
      name: "Product Category",
      url: "product-category",
      permissions: ["manage_product_categories"],
    },
    {
      name: "Price Rule",
      url: "price-rule",
      permissions: ["manage_price_rules"],
    },
    {
      name: "Permissions",
      url: "permissions",
      permissions: ["view_role_permissions", "assign_permissions"],
    },
    {
      name: "VAT Config",
      url: "vat-config",
      permissions: ["manage_vat_config"],
    },
    {
      name: "Role Permission",
      url: "role-permission",
      permissions: ["view_role_permissions", "assign_permissions"],
    },
  ];

  const settingsRoute = allSettingsRoutes.filter((r) =>
    hasAnyPermission(user, r.permissions)
  );

  const [currentScreen, setCurrentScreen] = useState<SettingsNav>(
    settingsRoute[0]?.url || "price-rule"
  );

  useEffect(() => {
    if (
      settingsRoute.length > 0 &&
      !settingsRoute.some((r) => r.url === currentScreen)
    ) {
      setCurrentScreen(settingsRoute[0].url);
    }
  }, [settingsRoute, currentScreen]);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-6 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
          <Settings2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">
            System Settings & Configuration
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Configure classifications, auditorium screen types, pricing rules, VAT, and RBAC permissions
          </p>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-64 bg-white rounded-2xl border border-[#c77e3b]/15 p-2.5 shadow-2xs flex flex-row lg:flex-col flex-wrap gap-1.5 shrink-0">
          {settingsRoute.map((routes) => {
            const isActive = currentScreen === routes.url;
            return (
              <button
                key={routes.url}
                type="button"
                onClick={() => setCurrentScreen(routes.url)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  isActive
                    ? "bg-gradient-to-r from-[#c77e3b] to-[#754f2c] text-white shadow-sm"
                    : "text-stone-600 hover:bg-[#fff8ea] hover:text-[#c77e3b]"
                }`}
              >
                <span>{routes.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fff8ea]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 w-full min-w-0">
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
    </div>
  );
};

export default Settings;
