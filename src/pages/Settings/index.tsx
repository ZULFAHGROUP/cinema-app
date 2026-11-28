import { useEffect, useState } from "react";
import {
  Settings2,
  ShieldAlert,
  MonitorPlay,
  Clock,
  Layers,
  Tag,
  Percent,
  UserCog,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

type SettingsNav =
  | "price-rule"
  | "vat-config"
  | "movie-classification"
  | "screen-type"
  | "showtime-status"
  | "product-category"
  | "roles"
  | "permissions"
  | "role-permission";

interface SettingsRouteProps {
  name: string;
  group: string;
  icon: LucideIcon;
  url: SettingsNav;
  permissions: string[];
}

const Settings = () => {
  const { user } = useAppSelector((state) => state.accounts.data);

  const allSettingsRoutes: SettingsRouteProps[] = [
    {
      name: "Price Rules",
      group: "Pricing & Tax",
      icon: Tag,
      url: "price-rule",
      permissions: ["manage_price_rules"],
    },
    {
      name: "VAT Configuration",
      group: "Pricing & Tax",
      icon: Percent,
      url: "vat-config",
      permissions: ["manage_vat_config"],
    },
    {
      name: "Movie Classifications",
      group: "Theater & Catalog",
      icon: ShieldAlert,
      url: "movie-classification",
      permissions: ["setup_movie_classification"],
    },
    {
      name: "Screen Formats",
      group: "Theater & Catalog",
      icon: MonitorPlay,
      url: "screen-type",
      permissions: ["setup_screen_type"],
    },
    {
      name: "Showtime Statuses",
      group: "Theater & Catalog",
      icon: Clock,
      url: "showtime-status",
      permissions: ["setup_showtime_status"],
    },
    {
      name: "Product Categories",
      group: "Theater & Catalog",
      icon: Layers,
      url: "product-category",
      permissions: ["manage_product_categories"],
    },
    {
      name: "Staff Roles",
      group: "Access & Security",
      icon: UserCog,
      url: "roles",
      permissions: ["assign_roles"],
    },
    {
      name: "System Permissions",
      group: "Access & Security",
      icon: KeyRound,
      url: "permissions",
      permissions: ["view_role_permissions", "assign_permissions"],
    },
    {
      name: "Role Permissions",
      group: "Access & Security",
      icon: ShieldCheck,
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

  const groups = Array.from(new Set(settingsRoute.map((r) => r.group)));

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-[#e6dfd3] p-6 shadow-[0_1px_2px_rgba(18,22,28,0.05)] flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#fff8ea] border border-[#e6dfd3] flex items-center justify-center text-[#c77e3b] shrink-0 mt-0.5">
          <Settings2 className="w-5 h-5" />
        </div>
        <div>
          <span className="eyebrow-chip mb-1.5">System Architecture</span>
          <h1 className="font-display text-2xl font-bold text-[#12161c] tracking-[-0.02em]">
            System Settings & Configuration
          </h1>
          <p className="text-[13px] text-[#686259] mt-0.5">
            Manage dynamic pricing rules, tax rates, auditorium formats, and
            role-based access control
          </p>
        </div>
      </div>

      {/* Categorized Settings Navigation + Active Workspace */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-64 bg-white rounded-2xl border border-[#e6dfd3] p-3.5 shadow-[0_1px_2px_rgba(18,22,28,0.05)] space-y-4 shrink-0">
          {groups.map((group) => (
            <div key={group} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a8275] mb-1.5">
                {group}
              </p>
              {settingsRoute
                .filter((r) => r.group === group)
                .map((route) => {
                  const isActive = currentScreen === route.url;
                  const Icon = route.icon;
                  return (
                    <button
                      key={route.url}
                      type="button"
                      onClick={() => setCurrentScreen(route.url)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                        isActive
                          ? "bg-[#c77e3b] text-white"
                          : "text-[#686259] hover:bg-[#fff8ea] hover:text-[#12161c]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? "text-white" : "text-[#c77e3b]"
                          }`}
                        />
                        <span className="truncate">{route.name}</span>
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
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
