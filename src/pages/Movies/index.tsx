/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useAppDispatch } from "../../store/hook";

function MoviesPage() {
  const [activeTab, setActiveTab] = useState("movies");
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [isAddShowtimeModalOpen, setIsAddShowtimeModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllClassifications());
  }, [dispatch, isAddMovieModalOpen]);

  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Spider-Man: No Way Home",
      genre: "Action/Adventure",
      duration: 148,
      rating: "PG-13",
      imdbRating: 8.4,
      releaseDate: "2021-12-17",
      status: "Now Playing",
      poster: "/spider-man-movie-poster.png",
      showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
      description:
        "Spider-Man's identity is revealed, causing chaos in his life.",
    },
    {
      id: 2,
      title: "Dune: Part Two",
      genre: "Sci-Fi/Drama",
      duration: 166,
      rating: "PG-13",
      imdbRating: 8.8,
      releaseDate: "2024-03-01",
      status: "Now Playing",
      poster: "/dune-part-two-poster.png",
      showtimes: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
      description:
        "Paul Atreides unites with Chani and the Fremen while seeking revenge.",
    },
    {
      id: 3,
      title: "The Batman",
      genre: "Action/Crime",
      duration: 176,
      rating: "PG-13",
      imdbRating: 7.8,
      releaseDate: "2022-03-04",
      status: "Coming Soon",
      poster: "/images/posters/the-batman-poster.png",
      showtimes: [],
      description:
        "Batman ventures into Gotham City's underworld when a sadistic killer leaves a trail of cryptic clues.",
    },
  ]);

  const [showtimes, setShowtimes] = useState([
    {
      id: 1,
      movieTitle: "Spider-Man: No Way Home",
      theater: "Theater 1",
      screen: "Screen A",
      time: "10:00 AM",
      date: "2024-01-15",
      availableSeats: 120,
      totalSeats: 150,
      price: 12.99,
    },
    {
      id: 2,
      movieTitle: "Dune: Part Two",
      theater: "Theater 2",
      screen: "Screen B",
      time: "2:30 PM",
      date: "2024-01-15",
      availableSeats: 180,
      totalSeats: 200,
      price: 15.99,
    },
  ]);

  const handleAddMovie = (movieData: any) => {
    const newMovie = {
      id: movies.length + 1,
      ...movieData,
      showtimes: [],
    };
    setMovies([...movies, newMovie]);
    setIsAddMovieModalOpen(false);
  };

  const handleAddShowtime = (showtimeData: any) => {
    const newShowtime = {
      id: showtimes.length + 1,
      ...showtimeData,
      availableSeats: 150, // Default total seats
      totalSeats: 150,
    };
    setShowtimes([...showtimes, newShowtime]);
    setIsAddShowtimeModalOpen(false);
  };

  const tabItems = [
    {
      key: "movies",
      label: (
        <span className="flex items-center gap-2">
          <Film className="w-4 h-4" /> Movies
        </span>
      ),
      children: <Movies movies={movies} />,
    },
    {
      key: "showtimes",
      label: (
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Showtimes
        </span>
      ),
      children: <Showtimes showtimes={showtimes} />,
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
      >
        <AddMovieForm
          onSubmit={handleAddMovie}
          onCancel={() => setIsAddMovieModalOpen(false)}
        />
      </DisplayModal>

      {/* Add Showtime Modal */}
      <DisplayModal
        open={isAddShowtimeModalOpen}
        onClose={() => setIsAddShowtimeModalOpen(false)}
        title="Add New Showtime"
      >
        <AddShowtimeForm
          movies={movies}
          onSubmit={handleAddShowtime}
          onCancel={() => setIsAddShowtimeModalOpen(false)}
        />
      </DisplayModal>
    </div>
  );
}

export default MoviesPage;
