/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Input, Pagination, Select } from "antd";
import Button from "../../components/shared/Button";
import { CalendarClock, CalendarDays, Clapperboard, Film, PauseCircle } from "lucide-react";
import StatCards from "../../components/shared/StatCards";
import { MovieFilters } from "../../services/network/movie";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import Movies from "./components/Movies";
import AddMovieForm from "./components/AddMovieForm";
import AddShowtimeForm from "./components/AddShowtimeForm";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import { getAllClassifications } from "../../store/slices/classification";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllShowtimes } from "../../store/slices/showtime";
import { getAllCinemas } from "../../store/slices/cinema";
import { getAllShowtimeStatuses } from "../../store/slices/showtimeStatus";
import { getAllMovies } from "../../store/slices/movie";
import { hasPermission, isAdminRole } from "../../utils/permissions";
// import ReusableSelect from "../../components/shared/Select";

function MoviesPage() {
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [isAddShowtimeModalOpen, setIsAddShowtimeModalOpen] = useState(false);
  // const [selectedCinemaId, setSelectedCinemaId] = useState<string>("");
  const [preSelectedMovie, setPreSelectedMovie] = useState<any>(null);
  const [showtimeLimitCount, setShowtimeLimitCount] = useState(10);
  const [filters, setFilters] = useState<MovieFilters>({});
  const [searchText, setSearchText] = useState("");
  const search = useDebouncedValue(searchText.trim());

  const { limit: classificationLimit, page: classificationPage } =
    useAppSelector((state) => state.classification);
  const { page: showtimePage } = useAppSelector(
    (state) => state.showtime
  );
  const { limit: statusLimit, page: statusPage } = useAppSelector(
    (state) => state.showtimeStatus
  );
  const { limit: cinemaLimit, page: cinemaPage } = useAppSelector(
    (state) => state.cinema
  );
  const { limit: movieLimit, page: moviePage } = useAppSelector(
    (state) => state.movie
  );
  // const { user } = useAppSelector((state) => state.accounts.data);
  // const isAdmin =
  //   user?.role?.toLowerCase() === "admin" ||
  //   user?.role?.toLowerCase() === "superadmin";

  const dispatch = useAppDispatch();

  // Back to page 1 whenever a filter or the search changes.
  useEffect(() => {
    dispatch(
      getAllMovies({ page: 1, limit: movieLimit, filters: { ...filters, search: search || undefined } })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filters, search]);

  useEffect(() => {
    dispatch(
      getAllClassifications({
        limit: classificationLimit,
        page: classificationPage,
      })
    );
    dispatch(getAllShowtimeStatuses({ page: statusPage, limit: statusLimit }));
    dispatch(getAllCinemas({ page: cinemaPage, limit: cinemaLimit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    // const cinemaIdToUse = isAdmin ? selectedCinemaId : undefined;
    dispatch(
      getAllShowtimes({
        limit: showtimeLimitCount,
        page: showtimePage,
        // cinema_id: cinemaIdToUse,
      })
    ).unwrap();
  }, [
    dispatch,
    // selectedCinemaId,
    // isAdmin,
    showtimeLimitCount,
    showtimePage,
  ]);

  const { movies, moviesLoading, total: totalMovies, stats: movieStats, filters: movieFilters } =
    useAppSelector((state) => state.movie);
  const {
    showtimes,
    showtimeLoading,
    total: totalShowtimes,
    stats: showtimeStats,
  } = useAppSelector((state) => state.showtime);
  const { classifications } = useAppSelector((state) => state.classification);

  const toggleActive = (value: boolean) =>
    setFilters((f) => ({ ...f, is_active: f.is_active === value ? undefined : value }));

  const statItems = [
    {
      label: "Movies",
      value: movieStats?.total_movies ?? 0,
      icon: Film,
      onClick: () => setFilters((f) => ({ ...f, is_active: undefined })),
    },
    {
      label: "Now showing",
      value: movieStats?.active_movies ?? 0,
      hint: `${movieStats?.inactive_movies ?? 0} inactive`,
      icon: Clapperboard,
      tone: "good" as const,
      onClick: () => toggleActive(true),
      active: filters.is_active === true,
    },
    {
      label: "Showtimes today",
      value: showtimeStats?.today ?? 0,
      icon: CalendarDays,
      tone: "info" as const,
    },
    {
      label: "Upcoming showtimes",
      value: showtimeStats?.upcoming ?? 0,
      hint: `${showtimeStats?.total_showtimes ?? 0} scheduled in total`,
      icon: CalendarClock,
      tone: "warning" as const,
    },
  ];
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const { user } = useAppSelector((state) => state.accounts.data);
  const isAdmin = isAdminRole(user);
  const canAddEditMovie = hasPermission(user, "add_edit_movies");
  const scopedCinemaId = !isAdmin ? user?.cinema_id : user?.scoped_cinema_id || "";
  const visibleCinemas = scopedCinemaId
    ? (allCinemas || []).filter((c: any) => c.cinema_id === scopedCinemaId)
    : allCinemas;
  const visibleShowtimes = scopedCinemaId
    ? (showtimes || []).filter((s: any) => s.screen?.cinema_id === scopedCinemaId)
    : showtimes;

  const handleAddShowtime = (movie: any) => {
    setPreSelectedMovie(movie);
    setIsAddShowtimeModalOpen(true);
  };
    
  return (
    <div className="p-6">
      {/* Header with Button */}
      <div className="flex items-center flex-col md:flex-row justify-between mb-6">
        <div>
           <h1 className="text-2xl font-sans font-bold text-foreground">Movies</h1>
           <p className="text-sm font-serif text-muted-foreground mt-1">Manage movies and showtimes</p>
        </div>
        <div className="flex gap-2 ml-4 items-center">
            {canAddEditMovie && (
              <Button
                onClick={() => setIsAddMovieModalOpen(true)}
                className="gap-2 rounded-md"
                icon={<Film className="w-4 h-4" />}
                title="Add Movie"
              />
            )}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <StatCards items={statItems} loading={moviesLoading} />
        <div className="flex flex-wrap gap-3 items-center">
          <Input.Search
            allowClear
            placeholder="Search title, director, cast or genre"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full md:w-80!"
          />
          <Select
            allowClear
            placeholder="All classifications"
            value={filters.movie_classification_id}
            onChange={(value) => setFilters((f) => ({ ...f, movie_classification_id: value }))}
            options={classifications?.map((c: any) => ({
              value: c.movie_classification_id,
              label: c.name,
            }))}
            className="w-48"
          />
          <Select
            placeholder="Status"
            value={filters.is_active === undefined ? "all" : filters.is_active ? "active" : "inactive"}
            onChange={(value) =>
              setFilters((f) => ({ ...f, is_active: value === "all" ? undefined : value === "active" }))
            }
            options={[
              { value: "all", label: "All movies" },
              { value: "active", label: "Now showing" },
              { value: "inactive", label: "Inactive" },
            ]}
            className="w-40"
            suffixIcon={<PauseCircle className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Movies Content */}
      <Movies 
        loading={moviesLoading || showtimeLoading} 
        movies={movies} 
        showtimes={visibleShowtimes}
        onAddShowtime={handleAddShowtime}
        cinemas={visibleCinemas}
        totalShowtimes={totalShowtimes}
        onLoadMoreShowtimes={() => setShowtimeLimitCount(prev => prev + 10)}
      />

      {!moviesLoading && movies.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No movies match these filters.</p>
      )}
      {totalMovies > movieLimit && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={moviePage}
            pageSize={movieLimit}
            total={totalMovies}
            showSizeChanger
            pageSizeOptions={[9, 12, 24, 48]}
            onChange={(page, pageSize) =>
              dispatch(getAllMovies({ page, limit: pageSize, filters: movieFilters }))
            }
          />
        </div>
      )}


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
           cinemas={visibleCinemas}
           onCancel={() => {
              setIsAddShowtimeModalOpen(false);
              setPreSelectedMovie(null);
           }}
           preSelectedMovieId={preSelectedMovie?.movie_id}
        />
      </DisplayModal>
    </div>
  );
}

export default MoviesPage;
