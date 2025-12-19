/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Button from "../../components/shared/Button";
import { Film } from "lucide-react";
import Movies from "./components/Movies";
import AddMovieForm from "./components/AddMovieForm";
import AddShowtimeForm from "./components/AddShowtimeForm";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import { getAllClassifications } from "../../store/slices/classification";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllShowtimes } from "../../store/slices/showtime";
import { getAllCinemas } from "../../store/slices/cinema";
import { getAllShowtimeStatuses } from "../../store/slices/showtimeStatus";
import ReusableSelect from "../../components/shared/Select";

function MoviesPage() {
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [isAddShowtimeModalOpen, setIsAddShowtimeModalOpen] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("");
  const [preSelectedMovie, setPreSelectedMovie] = useState<any>(null);

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
  const { user } = useAppSelector((state) => state.accounts.data);
  const isAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "superadmin";

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getAllClassifications({
        limit: classificationLimit,
        page: classificationPage,
      })
    );
    dispatch(getAllShowtimeStatuses({ page: statusPage, limit: statusLimit }));
    dispatch(getAllCinemas({ page: cinemaPage, limit: cinemaLimit }));
  }, [dispatch]);

  useEffect(() => {
    const cinemaIdToUse = isAdmin ? selectedCinemaId : undefined;
    dispatch(
      getAllShowtimes({
        limit: showtimeLimit,
        page: showtimePage,
        cinema_id: cinemaIdToUse,
      })
    ).unwrap();
  }, [
    dispatch,
    selectedCinemaId,
    isAdmin,
    showtimeLimit,
    showtimePage,
  ]);

  const { movies, moviesLoading } = useAppSelector((state) => state.movie);
  const { showtimes, showtimeLoading } = useAppSelector(
    (state) => state.showtime
  );
  const { allCinemas } = useAppSelector((state) => state.cinema);

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
             {isAdmin && (
               <div className="w-[300px]">
                  <ReusableSelect
                    label=""
                    name="cinema_id"
                    value={selectedCinemaId}
                    onChange={(val: any) => setSelectedCinemaId(val)}
                    options={allCinemas?.map((cinema: any) => ({
                      label: cinema.name,
                      value: cinema.cinema_id,
                    }))}
                    defaultOption="Select a cinema to see showtimes"
                  />
               </div>
             )}
            <Button
              onClick={() => setIsAddMovieModalOpen(true)}
              className="gap-2 rounded-md"
              icon={<Film className="w-4 h-4" />}
              title="Add Movie"
            />
        </div>
      </div>

      {/* Movies Content */}
      <Movies 
        loading={moviesLoading || showtimeLoading} 
        movies={movies} 
        showtimes={showtimes}
        onAddShowtime={handleAddShowtime}
        cinemas={allCinemas}
      />


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
