import { useState } from "react";
import Button from "../../components/shared/Button";
import MovieClassification from "./components/MovieClassification";
import SeatType from "./components/SeatType";
import ShowtimeStatus from "./components/ShowtimeStatus";

const Settings = () => {
  type settingsNav = "movie-classification" | "seat-type" | "showtime-status";
  const [currentScreen, setCurrentScreen] = useState<settingsNav>(
    "movie-classification"
  );
  interface SettingsRouteProps {
    name: string;
    url: settingsNav;
  }
  const settingsRoute: SettingsRouteProps[] = [
    { name: "Movie Classification", url: "movie-classification" },
    { name: "Seat Type", url: "seat-type" },
    { name: "Showtime Status", url: "showtime-status" },
  ];
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex flex-row flex-wrap md:flex-col gap-4 w-full md:w-[20%]">
        {settingsRoute.map((routes) => (
          <Button
            key={routes.url}
            className="rounded-full"
            variant={currentScreen === routes.url ? "extra" : "extra-outline"}
            onClick={() => setCurrentScreen(routes.url)}
            title={routes.name}
          />
        ))}
      </div>
      <div className="border-l border-l-[#5480c7] px-2 w-full md:w-[80%]">
        {currentScreen === "movie-classification" ? (
          <MovieClassification />
        ) : currentScreen === "seat-type" ? (
          <SeatType />
        ) : (
          <ShowtimeStatus />
        )}
      </div>
    </div>
  );
};

export default Settings;
