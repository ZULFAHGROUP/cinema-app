import { useEffect, useState } from "react";
import { Tabs } from "antd";
import Button from "../../components/shared/Button";
import { Film, Calendar } from "lucide-react";
import Movies from "./components/Movies";
import Showtimes from "./components/Showtimes";
import AddMovieForm from "./components/AddMovieForm";
import AddShowtimeForm from "./components/AddShowtimeForm";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import { getAllClassifications } from "../../store/slices/classification";
import { useAppDispatch, useAppSelector } from "../../store/hook";
// import { getAllMovies } from "../../store/slices/movie";
import { getAllShowtimes } from "../../store/slices/showtime";
import { getAllCinemas } from "../../store/slices/cinema";
// import { getAllScreen } from "../../store/slices/screen";
import { getAllShowtimeStatuses } from "../../store/slices/showtimeStatus";

function MoviesPage() {
  const [activeTab, setActiveTab] = useState("movies");
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [isAddShowtimeModalOpen, setIsAddShowtimeModalOpen] = useState(false);
  const { limit: classificationLimit, page: classificationPage } =
    useAppSelector((state) => state.classification);
  const { limit: showtimeLimit, page: showtimePage } = useAppSelector(
    (state) => state.showtime
  );
  const { limit: statusLimit, page: statusPage } = useAppSelector(
    (state) => state.showtimeStatus
  );
  const { limit: cinemaLimit, page: cinemaPage } = useAppSelector(
    (state) => state.cinema
  );
  // const { screensLimit, screensPage } = useAppSelector((state) => state.screen);

  const dispatch = useAppDispatch();
  useEffect(() => {
    // dispatch(getAllMovies());
    dispatch(
      getAllClassifications({
        limit: classificationLimit,
        page: classificationPage,
      })
    );
    dispatch(
      getAllShowtimes({ limit: showtimeLimit, page: showtimePage })
    ).unwrap();
    dispatch(getAllShowtimeStatuses({ page: statusPage, limit: statusLimit }));
    dispatch(getAllCinemas({ page: cinemaPage, limit: cinemaLimit }));
    // dispatch(getAllScreen({screensLimit,screensPage})).unwrap();
  }, [dispatch]);
  const { movies, moviesLoading } = useAppSelector((state) => state.movie);
  const { showtimes, showtimeLoading } = useAppSelector(
    (state) => state.showtime
  );
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const tabItems = [
    {
      key: "movies",
      label: (
        <span className="flex items-center gap-2">
          <Film className="w-4 h-4" /> Movies
        </span>
      ),
      children: <Movies loading={moviesLoading} movies={movies} />,
    },
    {
      key: "showtimes",
      label: (
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Showtimes
        </span>
      ),
      children: <Showtimes loading={showtimeLoading} showtimes={showtimes} />,
    },
  ];

  return (
    <div className="p-6">
      {/* Header with Tabs and Button in same line */}
      <div className="flex items-center flex-col md:flex-row justify-between mb-6">
        <div className="flex-1">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems.map((item) => ({
              key: item.key,
              label: item.label,
            }))}
            className="movies-tabs"
          />
        </div>
        <div className="flex gap-2 ml-4">
          {activeTab === "movies" && (
            <Button
              onClick={() => setIsAddMovieModalOpen(true)}
              className="gap-2 rounded-md"
              icon={<Film className="w-4 h-4" />}
              title="Add Movie"
            />
          )}
          {activeTab === "showtimes" && (
            <Button
              onClick={() => setIsAddShowtimeModalOpen(true)}
              className="gap-2 rounded-md"
              icon={<Calendar className="w-4 h-4" />}
              title="Add Showtime"
            />
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tabItems.find((item) => item.key === activeTab)?.children}
      </div>

      {/* Add Movie Modal */}
      <DisplayModal
        open={isAddMovieModalOpen}
        onClose={() => setIsAddMovieModalOpen(false)}
        title="Add New Movie"
        width={900}
      >
        <AddMovieForm onCancel={() => setIsAddMovieModalOpen(false)} />
      </DisplayModal>

      {/* Add Showtime Modal */}
      <DisplayModal
        open={isAddShowtimeModalOpen}
        onClose={() => setIsAddShowtimeModalOpen(false)}
        title="Add New Showtime"
      >
        <AddShowtimeForm
          movies={movies}
          cinemas={allCinemas}
          onCancel={() => setIsAddShowtimeModalOpen(false)}
        />
      </DisplayModal>
    </div>
  );
}

export default MoviesPage;
