/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import Button from "../../../components/shared/Button";
import { Tag, Dropdown, Collapse } from "antd";
import {
  Edit,
  Clock,
  Trash2,
  Calendar,
  MoreVertical,
  PauseCircle,
  Star,
  Globe,
} from "lucide-react";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import { useState } from "react";
import AddMovieForm from "./AddMovieForm";
import AddShowtimeForm from "./AddShowtimeForm";
import Loader from "../../../components/shared/Loader";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { deleteMovie, getAllMovies } from "../../../store/slices/movie";
import {
  deleteShowtime,
  getAllShowtimes,
} from "../../../store/slices/showtime";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { getHumanDate, getHumanTime, getImageUrl } from "../../../utils";
import { hasPermission, isAdminRole } from "../../../utils/permissions";
import Movie from "../../../services/network/movie";

const Movies = ({
  movies,
  showtimes,
  loading,
  onAddShowtime,
  cinemas,
  totalShowtimes,
  onLoadMoreShowtimes,
}: any) => {
  const [isEditMovieModalOpen, setIsEditMovieModalOpen] = useState(false);
  const [isEditShowtimeModalOpen, setIsEditShowtimeModalOpen] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);

  const [showDeleteMovieModal, setShowDeleteMovieModal] = useState(false);
  const [showDeleteShowtimeModal, setShowDeleteShowtimeModal] = useState(false);

  const { limit, page, filters: movieFilters } = useAppSelector(
    (state) => state.movie
  );
  const { limit: showtimeLimit, page: showtimePage } = useAppSelector(
    (state) => state.showtime
  );

  const dispatch = useAppDispatch();

  const handleDeleteMovie = async () => {
    if (!selectedMovie) return;
    try {
      const response = await dispatch(
        deleteMovie(selectedMovie?.movie_id)
      ).unwrap();
      if (response.code === 200) {
        await dispatch(getAllMovies({ page, limit, filters: movieFilters }));
        setShowDeleteMovieModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting movie");
      setShowDeleteMovieModal(false);
    }
  };

  const { user } = useAppSelector((state) => state.accounts.data);
  const isAdmin = isAdminRole(user);
  const canAddEditMovie = hasPermission(user, "add_edit_movies");
  const canScheduleShowtimes = hasPermission(user, "schedule_showtimes");
  const canEditShowtimes = hasPermission(user, "edit_showtimes");
  const canCancelShowtimes = hasPermission(user, "cancel_showtimes");

  const handleDeactivateMovie = async (movie: any) => {
    try {
      const res = await Movie.deactivateMovie(movie.movie_id);
      toast.success(res.data?.message || "Movie deactivated");
      await dispatch(getAllMovies({ page, limit, filters: movieFilters }));
    } catch (error: any) {
      toast.error(error?.message || "Error deactivating movie");
    }
  };

  const handleDeleteShowtime = async () => {
    if (!selectedShowtime) return;
    try {
      const cinemaIdToUse = isAdmin
        ? selectedShowtime?.screen?.cinema_id
        : undefined;

      const response = await dispatch(
        deleteShowtime({
          id: selectedShowtime?.showtime_id,
          cinema_id: cinemaIdToUse,
        })
      ).unwrap();
      if (response.code === 200) {
        toast.success("Showtime deleted successfully");
        await dispatch(
          getAllShowtimes({
            page: showtimePage,
            limit: showtimeLimit,
            cinema_id: cinemaIdToUse,
          })
        );
        setShowDeleteShowtimeModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting showtime");
      setShowDeleteShowtimeModal(false);
    }
  };

  const getGroupedShowtimes = (movieShowtimes: any[]) => {
    const grouped: {
      [key: string]: { cinemaName: string; showtimes: any[] };
    } = {};

    movieShowtimes.forEach((st) => {
      const cinemaName = st.screen?.cinema?.name || "Unknown Cinema";
      const cinemaId = st.screen?.cinema_id;

      if (!grouped[cinemaId]) {
        grouped[cinemaId] = { cinemaName, showtimes: [] };
      }
      grouped[cinemaId].showtimes.push(st);
    });

    return Object.values(grouped);
  };

  return (
    <>
      {loading ? (
        <Loader rows={8} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies?.map((movie: any) => {
            const movieShowtimes =
              showtimes?.filter((st: any) => st.movie_id === movie.movie_id) ||
              [];
            const groupedShowtimes = getGroupedShowtimes(movieShowtimes);
            const classificationLabel =
              movie.movie_classification?.name ||
              movie.movieClassification?.name ||
              (typeof movie.movieClassification === "string"
                ? movie.movieClassification
                : "PG");
            const genresList =
              typeof movie.genres === "string"
                ? movie.genres
                    .split(",")
                    .map((g: string) => g.trim())
                    .filter(Boolean)
                : Array.isArray(movie.genres)
                ? movie.genres
                : [];

            return (
              <Card
                key={movie.movie_id}
                className="overflow-hidden py-0! gap-0! flex flex-col justify-between group"
              >
                <div>
                  {/* Poster Banner */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-stone-900">
                    <img
                      src={getImageUrl(movie.poster_url)}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#c77e3b] text-white text-xs font-bold shadow-sm">
                        {classificationLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-[#fff8ea] text-xs font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {movie.rating}
                      </span>
                    </div>

                    {/* Bottom Meta on Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#c77e3b]" />
                        {movie.duration} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-[#c77e3b]" />
                        {movie.language}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pt-5 pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <CardTitle className="text-lg leading-snug">
                          {movie.title}
                        </CardTitle>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Released{" "}
                          {new Date(movie.release_date).toLocaleDateString()}
                        </p>
                      </div>
                      {(canScheduleShowtimes || canAddEditMovie) && (
                        <Dropdown
                          menu={{
                            items: [
                              ...(canScheduleShowtimes
                                ? [
                                    {
                                      key: "1",
                                      label: "Add Showtime",
                                      icon: <Calendar className="w-4 h-4" />,
                                      onClick: () => onAddShowtime(movie),
                                    },
                                  ]
                                : []),
                              ...(canAddEditMovie
                                ? [
                                    {
                                      key: "2",
                                      label: "Edit Movie",
                                      icon: <Edit className="w-4 h-4" />,
                                      onClick: () => {
                                        setSelectedMovie(movie);
                                        setIsEditMovieModalOpen(true);
                                      },
                                    },
                                    ...(movie.is_active !== false
                                      ? [
                                          {
                                            key: "deactivate",
                                            label: "Deactivate Movie",
                                            icon: (
                                              <PauseCircle className="w-4 h-4" />
                                            ),
                                            onClick: () =>
                                              handleDeactivateMovie(movie),
                                          },
                                        ]
                                      : []),
                                    {
                                      key: "3",
                                      label: "Delete Movie",
                                      danger: true,
                                      icon: <Trash2 className="w-4 h-4" />,
                                      onClick: () => {
                                        setSelectedMovie(movie);
                                        setShowDeleteMovieModal(true);
                                      },
                                    },
                                  ]
                                : []),
                            ],
                          }}
                          trigger={["click"]}
                        >
                          <Button
                            size="xs"
                            variant="outline"
                            className="p-1.5! border-stone-200! text-stone-600! hover:text-white!"
                            icon={<MoreVertical size={16} />}
                          />
                        </Dropdown>
                      )}
                    </div>

                    {/* Genre Pills */}
                    {genresList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {genresList.map((g: string) => (
                          <span
                            key={g}
                            className="px-2.5 py-0.5 rounded-full bg-[#fff8ea] text-[#754f2c] border border-[#c77e3b]/20 text-[11px] font-semibold"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="pb-5 space-y-4">
                    <div className="rounded-xl bg-[#fff8ea]/60 border border-[#c77e3b]/15 p-3 text-xs space-y-1">
                      <p className="text-stone-700 truncate">
                        <span className="font-bold text-[#754f2c]">
                          Director:
                        </span>{" "}
                        {movie.director}
                      </p>
                      <p className="text-stone-700 truncate">
                        <span className="font-bold text-[#754f2c]">Cast:</span>{" "}
                        {movie.cast}
                      </p>
                    </div>

                    {/* Nested Grouped Showtimes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                          Scheduled Showtimes ({movieShowtimes.length})
                        </p>
                      </div>
                      {groupedShowtimes.length > 0 ? (
                        <>
                          <Collapse
                            ghost
                            className="bg-stone-50/80 rounded-xl border border-stone-200/70"
                            items={groupedShowtimes.map((group: any) => ({
                              key: group.cinemaName,
                              label: (
                                <span className="text-xs font-bold text-[#754f2c]">
                                  {group.cinemaName} ({group.showtimes.length})
                                </span>
                              ),
                              children: (
                                <div className="flex flex-col gap-1.5">
                                  {group.showtimes.map((st: any) => (
                                    <div
                                      key={st.showtime_id}
                                      className="flex items-center justify-between bg-white border border-[#c77e3b]/15 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-stone-800">
                                          {getHumanDate(st.show_date)}
                                        </span>
                                        <span className="text-stone-300">•</span>
                                        <span className="font-bold text-[#c77e3b]">
                                          {getHumanTime(st.show_time)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <Tag
                                          className="mr-0 text-[10px]"
                                          color={
                                            st.showtimeStatus?.name ===
                                            "Scheduled"
                                              ? "blue"
                                              : "default"
                                          }
                                        >
                                          {st.showtimeStatus?.name}
                                        </Tag>
                                        {(canEditShowtimes ||
                                          canCancelShowtimes) && (
                                          <Dropdown
                                            menu={{
                                              items: [
                                                ...(canEditShowtimes
                                                  ? [
                                                      {
                                                        key: "1",
                                                        label: "Edit",
                                                        icon: (
                                                          <Edit className="w-3 h-3" />
                                                        ),
                                                        onClick: () => {
                                                          setSelectedShowtime(
                                                            st
                                                          );
                                                          setIsEditShowtimeModalOpen(
                                                            true
                                                          );
                                                        },
                                                      },
                                                    ]
                                                  : []),
                                                ...(canCancelShowtimes
                                                  ? [
                                                      {
                                                        key: "2",
                                                        label: "Delete",
                                                        danger: true,
                                                        icon: (
                                                          <Trash2 className="w-3 h-3" />
                                                        ),
                                                        onClick: () => {
                                                          setSelectedShowtime(
                                                            st
                                                          );
                                                          setShowDeleteShowtimeModal(
                                                            true
                                                          );
                                                        },
                                                      },
                                                    ]
                                                  : []),
                                              ],
                                            }}
                                            trigger={["click"]}
                                          >
                                            <MoreVertical
                                              size={14}
                                              className="cursor-pointer text-stone-400 hover:text-stone-700"
                                            />
                                          </Dropdown>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ),
                            }))}
                          />
                          {showtimes.length < totalShowtimes && (
                            <div className="mt-2 text-center">
                              <button
                                onClick={onLoadMoreShowtimes}
                                className="text-[11px] text-[#c77e3b] font-bold uppercase tracking-wider hover:underline flex items-center gap-1 mx-auto cursor-pointer"
                              >
                                Load More Showtimes...
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-stone-400 italic py-2">
                          No showtimes scheduled yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Movie Confirmation */}
      <ConfirmationModal
        open={showDeleteMovieModal}
        onCancel={() => setShowDeleteMovieModal(false)}
        onConfirm={handleDeleteMovie}
        item={selectedMovie?.title}
      />

      {/* Delete Showtime Confirmation */}
      <ConfirmationModal
        open={showDeleteShowtimeModal}
        onCancel={() => setShowDeleteShowtimeModal(false)}
        onConfirm={handleDeleteShowtime}
        item="this showtime"
        title="Delete Showtime"
        content="Are you sure you want to delete this showtime?"
      />

      {/* Edit Movie Modal */}
      <DisplayModal
        open={isEditMovieModalOpen}
        onClose={() => setIsEditMovieModalOpen(false)}
        title="Update Movie"
        width={900}
      >
        <AddMovieForm
          editMode
          movieData={selectedMovie}
          onCancel={() => setIsEditMovieModalOpen(false)}
        />
      </DisplayModal>

      {/* Edit Showtime Modal */}
      <DisplayModal
        open={isEditShowtimeModalOpen}
        onClose={() => setIsEditShowtimeModalOpen(false)}
        title="Update Showtime"
        width={680}
      >
        <AddShowtimeForm
          editMode
          showTimeData={selectedShowtime}
          movies={movies}
          cinemas={cinemas}
          onCancel={() => setIsEditShowtimeModalOpen(false)}
        />
      </DisplayModal>
    </>
  );
};

export default Movies;
