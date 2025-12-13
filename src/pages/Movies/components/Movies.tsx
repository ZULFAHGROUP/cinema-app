/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import Button from "../../../components/shared/Button";
import { Tag } from "antd";
import { Edit, Clock, Trash2 } from "lucide-react";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import { useState } from "react";
import AddMovieForm from "./AddMovieForm";
import Loader from "../../../components/shared/Loader";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { deleteMovie, getAllMovies } from "../../../store/slices/movie";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { getHumanDate, getHumanTime } from "../../../utils";

const Movies = ({ movies, loading }: any) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [movieData, setMovieData] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { limit, page } = useAppSelector((state) => state.movie);

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (!movieData) return;

    try {
      const response = await dispatch(
        deleteMovie(movieData?.movie_id)
      ).unwrap();
      if (response.code === 200) {
        await dispatch(getAllMovies({ page, limit }));
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message);
      setShowDeleteModal(false);
    }
  };
  return (
    <>
      {loading ? (
        <Loader rows={8} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies?.map((movie: any) => (
            <Card
              key={movie.movie_id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-3/3 relative">
                <img
                  src={movie.poster_url || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                {/* <Tag
              className="absolute top-2 right-2"
              color={movie.status === "Now Playing" ? "green" : "blue"}
            >
              {movie.status}
            </Tag> */}
              </div>
              <CardHeader>
                <CardTitle className="font-sans text-lg">
                  {movie.title}
                </CardTitle>
                <CardDescription className="font-serif">
                  <p>{movie.language}</p>
                  <p>{movie.movieClassification}</p>
                  <p>
                    <strong>Genres:</strong> <span>{movie.genres}</span>
                  </p>
                  {/* <div className="max-h-16 h-fit">
                    {movie.genres.length > 0 && (
                      <div className="">
                        <div className="flex flex-wrap gap-1">
                          {movie.genres.slice(0, 3).map((genre: any) => (
                            <Tag key={genre} color="blue" className="text-xs">
                              {genre}
                            </Tag>
                          ))}
                          {movie.genres.length > 3 && (
                            <Tag color="blue" className="text-xs">
                              +{movie.genres.length - 3} more
                            </Tag>
                          )}
                        </div>
                      </div>
                    )}
                  </div> */}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-serif">{movie.duration} min</span>
                    </div>
                    {/* <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-serif">{movie.imdbRating}</span>
                </div> */}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag color="orange">{movie.rating}</Tag>
                    <span className="text-sm font-serif text-muted-foreground">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="min-h-12 border-t border-b py-2">
                    <p>
                      <strong>Director:</strong> <span>{movie.director}</span>
                    </p>
                    {/* {movie.cast.length > 0 && (
                      <div className="">
                        <p className="text-sm font-serif text-muted-foreground mb-2">
                          Popular Cast
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {movie.cast.slice(0, 3).map((cast: any) => (
                            <Tag key={cast} color="blue" className="text-xs">
                              {cast}
                            </Tag>
                          ))}
                          {movie.showtimes.length > 3 && (
                            <Tag color="blue" className="text-xs">
                              +{movie.cast.length - 3} more
                            </Tag>
                          )}
                        </div>
                      </div>
                    )} */}
                    <p>
                      <strong>Cast:</strong> <span>{movie.cast}</span>
                    </p>
                  </div>
                  <div className="p-2">
                    {movie.showtimes.length > 0 ? (
                      <div className="h-20">
                        <p className="text-sm font-serif text-muted-foreground mb-2">
                          Showtimes
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {movie.showtimes.slice(0, 3).map((showtime: any) => (
                            <Tag
                              key={showtime.showtime_id}
                              color="blue"
                              className="text-xs"
                            >
                             {getHumanDate(showtime.show_date)} - {getHumanTime(showtime.show_time)
                               }
                            </Tag>
                          ))}
                          {movie.showtimes.length > 3 && (
                            <Tag color="blue" className="text-xs">
                              +{movie.showtimes.length - 3} more
                            </Tag>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p>No available showtimes!</p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 gap-2 rounded-md"
                      icon={<Edit className="w-3 h-3" />}
                      title="Edit"
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setMovieData(movie);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-md"
                      // icon={<Play className="w-3 h-3" />}
                      icon={<Trash2 className="w-3 h-3" />}
                      onClick={() => {
                        setMovieData(movie);
                        setShowDeleteModal(true);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        item={movieData?.title}
      />

      {/* Add Movie Modal */}
      <DisplayModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Movie"
        width={900}
      >
        <AddMovieForm
          editMode
          movieData={movieData}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </DisplayModal>
    </>
  );
};

export default Movies;
