import { useState } from "react";
import Button from "../../components/shared/Button";
import MovieClassification from "./components/MovieClassification";
import SeatType from "./components/SeatType";
import ShowtimeStatus from "./components/ShowtimeStatus";
import Roles from "./components/Roles";

const Settings = () => {
  type SettingsNav =
    | "movie-classification"
    | "seat-type"
    | "showtime-status"
    | "roles";
  const [currentScreen, setCurrentScreen] = useState<SettingsNav>(
    "movie-classification"
  );
  interface SettingsRouteProps {
    name: string;
    url: SettingsNav;
  }
  const settingsRoute: SettingsRouteProps[] = [
    { name: "Movie Classification", url: "movie-classification" },
    { name: "Seat Type", url: "seat-type" },
    { name: "Showtime Status", url: "showtime-status" },
    { name: "Roles", url: "roles" },
  ];
  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-2">
      <div className="flex flex-row flex-wrap md:flex-col gap-4 w-full md:w-[20%]">
        {settingsRoute.map((routes) => (
          <Button
            key={routes.url}
            className="rounded-"
            variant={currentScreen === routes.url ? "extra" : "extra-outline"}
            onClick={() => setCurrentScreen(routes.url)}
            title={routes.name}
          />
        ))}
      </div>
      <div className="md:border-l md:border-l-[#5480c7] md:px-2 w-full md:w-[80%]">
        {currentScreen === "movie-classification" ? (
          <MovieClassification />
        ) : currentScreen === "seat-type" ? (
          <SeatType />
        ) : currentScreen === "showtime-status" ? (
          <ShowtimeStatus />
        ) : (
          <Roles />
        )}
      </div>
    </div>
  );
};

export default Settings;
