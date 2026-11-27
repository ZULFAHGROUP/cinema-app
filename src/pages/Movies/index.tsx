/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Input, Pagination, Select } from "antd";
import Button from "../../components/shared/Button";
import {
  CalendarClock,
  CalendarDays,
  Clapperboard,
  Film,
  PauseCircle,
} from "lucide-react";
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

function MoviesPage() {
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [isAddShowtimeModalOpen, setIsAddShowtimeModalOpen] = useState(false);
  const [preSelectedMovie, setPreSelectedMovie] = useState<any>(null);
  const [showtimeLimitCount, setShowtimeLimitCount] = useState(10);
  const [filters, setFilters] = useState<MovieFilters>({});
  const [searchText, setSearchText] = useState("");
  const search = useDebouncedValue(searchText.trim());

  const { limit: classificationLimit, page: classificationPage } =
    useAppSelector((state) => state.classification);
  const { page: showtimePage } = useAppSelector((state) => state.showtime);
  const { limit: statusLimit, page: statusPage } = useAppSelector(
    (state) => state.showtimeStatus
  );
  const { limit: cinemaLimit, page: cinemaPage } = useAppSelector(
    (state) => state.cinema
  );
  const { limit: movieLimit, page: moviePage } = useAppSelector(
    (state) => state.movie
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getAllMovies({
        page: 1,
        limit: movieLimit,
        filters: { ...filters, search: search || undefined },
      })
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
    dispatch(
      getAllShowtimes({
        limit: showtimeLimitCount,
        page: showtimePage,
      })
    ).unwrap();
  }, [dispatch, showtimeLimitCount, showtimePage]);

  const {
    movies,
    moviesLoading,
    total: totalMovies,
    stats: movieStats,
    filters: movieFilters,
  } = useAppSelector((state) => state.movie);
  const {
    showtimes,
    showtimeLoading,
    total: totalShowtimes,
    stats: showtimeStats,
  } = useAppSelector((state) => state.showtime);
  const { classifications } = useAppSelector((state) => state.classification);

  const toggleActive = (value: boolean) =>
    setFilters((f) => ({
      ...f,
      is_active: f.is_active === value ? undefined : value,
    }));

  const statItems = [
    {
      label: "Total Movies",
      value: movieStats?.total_movies ?? 0,
      icon: Film,
      onClick: () => setFilters((f) => ({ ...f, is_active: undefined })),
    },
    {
      label: "Now Showing",
      value: movieStats?.active_movies ?? 0,
      hint: `${movieStats?.inactive_movies ?? 0} inactive`,
      icon: Clapperboard,
      tone: "good" as const,
      onClick: () => toggleActive(true),
      active: filters.is_active === true,
    },
    {
      label: "Showtimes Today",
      value: showtimeStats?.today ?? 0,
      icon: CalendarDays,
      tone: "info" as const,
    },
    {
      label: "Upcoming Showtimes",
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
  const scopedCinemaId = !isAdmin
    ? user?.cinema_id
    : user?.scoped_cinema_id || "";
  const visibleCinemas = scopedCinemaId
    ? (allCinemas || []).filter((c: any) => c.cinema_id === scopedCinemaId)
    : allCinemas;
  const visibleShowtimes = scopedCinemaId
    ? (showtimes || []).filter(
        (s: any) => s.screen?.cinema_id === scopedCinemaId
      )
    : showtimes;

  const handleAddShowtime = (movie: any) => {
    setPreSelectedMovie(movie);
    setIsAddShowtimeModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">
              Movies & Showtimes
            </h1>
            <p className="text-sm text-stone-500 mt-0.5">
              Curate your film catalogue, age ratings, and auditorium schedules
            </p>
          </div>
        </div>
        {canAddEditMovie && (
          <Button
            onClick={() => setIsAddMovieModalOpen(true)}
            icon={<Film className="w-4 h-4" />}
            title="Add Movie"
          />
        )}
      </div>

      {/* Stats & Filter Bar */}
      <StatCards items={statItems} loading={moviesLoading} />

      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-4 shadow-2xs flex flex-wrap gap-3 items-center">
        <Input.Search
          allowClear
          placeholder="Search title, director, cast or genre..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-80!"
        />
        <Select
          allowClear
          placeholder="All classifications"
          value={filters.movie_classification_id}
          onChange={(value) =>
            setFilters((f) => ({ ...f, movie_classification_id: value }))
          }
          options={classifications?.map((c: any) => ({
            value: c.movie_classification_id,
            label: c.name,
          }))}
          className="w-48"
        />
        <Select
          placeholder="Status"
          value={
            filters.is_active === undefined
              ? "all"
              : filters.is_active
              ? "active"
              : "inactive"
          }
          onChange={(value) =>
            setFilters((f) => ({
              ...f,
              is_active: value === "all" ? undefined : value === "active",
            }))
          }
          options={[
            { value: "all", label: "All movies" },
            { value: "active", label: "Now showing" },
            { value: "inactive", label: "Inactive" },
          ]}
          className="w-44"
          suffixIcon={<PauseCircle className="w-4 h-4" />}
        />
      </div>

      {/* Movies Content */}
      <Movies
        loading={moviesLoading || showtimeLoading}
        movies={movies}
        showtimes={visibleShowtimes}
        onAddShowtime={handleAddShowtime}
        cinemas={visibleCinemas}
        totalShowtimes={totalShowtimes}
        onLoadMoreShowtimes={() => setShowtimeLimitCount((prev) => prev + 10)}
      />

      {!moviesLoading && movies.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-[#c77e3b]/30 py-16 text-center">
          <Film className="w-10 h-10 text-[#c77e3b] mx-auto mb-2 opacity-75" />
          <p className="font-bold text-stone-800">No movies match these filters</p>
          <p className="text-xs text-stone-500 mt-1">
            Try clearing your search query or adding a new movie.
          </p>
        </div>
      )}

      {totalMovies > movieLimit && (
        <div className="flex justify-center pt-4">
          <Pagination
            current={moviePage}
            pageSize={movieLimit}
            total={totalMovies}
            showSizeChanger
            pageSizeOptions={[9, 12, 24, 48]}
            onChange={(page, pageSize) =>
              dispatch(
                getAllMovies({ page, limit: pageSize, filters: movieFilters })
              )
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
        title="Schedule New Showtime"
        width={680}
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
