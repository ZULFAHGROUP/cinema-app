/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import Button from "../../../components/shared/Button";
import { Tag, Dropdown, Collapse } from "antd";
import { Edit, Clock, Trash2, Calendar, MoreVertical } from "lucide-react";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import { useState } from "react";
import AddMovieForm from "./AddMovieForm";
import AddShowtimeForm from "./AddShowtimeForm";
import Loader from "../../../components/shared/Loader";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { deleteMovie, getAllMovies } from "../../../store/slices/movie";
import { deleteShowtime, getAllShowtimes } from "../../../store/slices/showtime";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { getHumanDate, getHumanTime } from "../../../utils";

const Movies = ({ movies, showtimes, loading, onAddShowtime, cinemas, totalShowtimes, onLoadMoreShowtimes }: any) => {
  const [isEditMovieModalOpen, setIsEditMovieModalOpen] = useState(false);
  const [isEditShowtimeModalOpen, setIsEditShowtimeModalOpen] = useState(false);
  
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);

  const [showDeleteMovieModal, setShowDeleteMovieModal] = useState(false);
  const [showDeleteShowtimeModal, setShowDeleteShowtimeModal] = useState(false);

  const { limit, page } = useAppSelector((state) => state.movie);
  const { limit: showtimeLimit, page: showtimePage } = useAppSelector((state) => state.showtime);

  const dispatch = useAppDispatch();

  // Handle Delete Movie
  const handleDeleteMovie = async () => {
    if (!selectedMovie) return;
    try {
      const response = await dispatch(deleteMovie(selectedMovie?.movie_id)).unwrap();
      if (response.code === 200) {
        await dispatch(getAllMovies({ page, limit }));
        setShowDeleteMovieModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting movie");
      setShowDeleteMovieModal(false);
    }
  };

  // Handle Delete Showtime
  const { user } = useAppSelector((state) => state.accounts.data);
  const isAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "superadmin";

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
            // Refresh showtimes
            await dispatch(getAllShowtimes({ page: showtimePage, limit: showtimeLimit,cinema_id: cinemaIdToUse, }));
            setShowDeleteShowtimeModal(false);
        }
      } catch (error: any) {
        toast.error(error?.response?.message || "Error deleting showtime");
        setShowDeleteShowtimeModal(false);
      }
  };


  // Helper to group showtimes by cinema
  const getGroupedShowtimes = (movieShowtimes: any[]) => {
      const grouped: { [key: string]: { cinemaName: string, showtimes: any[] } } = {};
      
      movieShowtimes.forEach(st => {
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
             // Filter showtimes for this movie
             const movieShowtimes = showtimes?.filter((st: any) => st.movie_id === movie.movie_id) || [];
             const groupedShowtimes = getGroupedShowtimes(movieShowtimes);

             return (
            <Card
              key={movie.movie_id}
              className="overflow-hidden hover:shadow-md transition-shadow relative"
            >
              <div className="aspect-3/3 relative">
                <img
                  src={movie.poster_url || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="font-sans text-lg">
                    {movie.title}
                    </CardTitle>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: '1',
                                    label: 'Add Showtime',
                                    icon: <Calendar className="w-4 h-4"/>,
                                    onClick: () => onAddShowtime(movie)
                                },
                                {
                                    key: '2',
                                    label: 'Edit Movie',
                                    icon: <Edit className="w-4 h-4"/>,
                                    onClick: () => {
                                        setSelectedMovie(movie);
                                        setIsEditMovieModalOpen(true);
                                    }
                                },
                                {
                                    key: '3',
                                    label: 'Delete Movie',
                                    danger: true,
                                    icon: <Trash2 className="w-4 h-4"/>,
                                    onClick: () => {
                                        setSelectedMovie(movie);
                                        setShowDeleteMovieModal(true);
                                    }
                                }
                            ]
                        }}
                        trigger={['click']}
                    >
                         <Button
                          size="sm"
                          className="p-0 bg-transparent w-fit shadow-none text-black!"
                          icon={<MoreVertical className="" size={20} />}
                        />
                    </Dropdown>
                </div>
                
                <CardDescription className="font-serif">
                  <p>{movie.language}</p>
                  <p>{movie.movieClassification}</p>
                  <p>
                    <strong>Genres:</strong> <span>{movie.genres}</span>
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-serif">{movie.duration} min</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag>{movie.rating}</Tag>
                    <span className="text-sm font-serif text-muted-foreground">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="border-t border-b py-2">
                    <p className="text-sm">
                      <strong>Director:</strong> <span>{movie.director}</span>
                    </p>                   
                    <p className="text-sm">
                      <strong>Cast:</strong> <span>{movie.cast}</span>
                    </p>
                  </div>
                  
                  {/* Nested Grouped Showtimes */}
                  <div className="pt-2">
                    <p className="text-sm font-serif font-semibold mb-2">Showtimes</p>
                    {groupedShowtimes.length > 0 ? (
                        <>
                            <Collapse
                                ghost
                                items={groupedShowtimes.map((group: any) => ({
                                    key: group.cinemaName,
                                    label: <span className="text-xs font-bold text-slate-700">{group.cinemaName}</span>,
                                    children: (
                                    <div className="flex flex-col gap-1">
                                        {group.showtimes.map((st: any) => (
                                            <div key={st.showtime_id} className="flex items-center justify-between bg-white border rounded px-2 py-1 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{getHumanDate(st.show_date)}</span>
                                                        <span className="text-slate-500">|</span>
                                                        <span>{getHumanTime(st.show_time)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="mr-0" color={st.showtimeStatus?.name === 'Scheduled' ? 'blue' : 'default'}>
                                                            {st.showtimeStatus?.name}
                                                        </Tag>
                                                        <Dropdown
                                                            menu={{
                                                                items: [
                                                                    {
                                                                        key: '1',
                                                                        label: 'Edit',
                                                                        icon: <Edit className="w-3 h-3"/>,
                                                                        onClick: () => {
                                                                            setSelectedShowtime(st);
                                                                            setIsEditShowtimeModalOpen(true);
                                                                        }
                                                                    },
                                                                    {
                                                                        key: '2',
                                                                        label: 'Delete',
                                                                        danger: true,
                                                                        icon: <Trash2 className="w-3 h-3"/>,
                                                                        onClick: () => {
                                                                            setSelectedShowtime(st);
                                                                            setShowDeleteShowtimeModal(true);
                                                                        }
                                                                    }
                                                                ]
                                                            }}
                                                            trigger={['click']}
                                                        >
                                                            <MoreVertical size={14} className="cursor-pointer text-slate-400 hover:text-slate-700"/>
                                                        </Dropdown>
                                                    </div>
                                            </div>
                                        ))}
                                    </div>
                                    )
                                }))}
                            />
                            {showtimes.length < totalShowtimes && (
                                <div className="mt-2 text-center">
                                    <button 
                                        onClick={onLoadMoreShowtimes}
                                        className="text-[10px] text- font-bold uppercase tracking-wider hover:underline flex items-center gap-1 mx-auto"
                                    >
                                        Load More Showtimes...
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No showtimes scheduled.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )})}
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
