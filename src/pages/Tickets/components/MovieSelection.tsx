/* eslint-disable @typescript-eslint/no-explicit-any */
import { Clock } from "lucide-react";

interface MovieSelectionProps {
  movies: any[];
  onSelect: (movie: any) => void;
}

export default function MovieSelection({
  movies,
  onSelect,
}: MovieSelectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-sans font-semibold">Select Movie</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="cursor-pointer border rounded-lg hover:shadow-md transition-shadow p-4"
            onClick={() => onSelect(movie)}
          >
            <div className="flex gap-4">
              <img
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-sans font-semibold text-lg">
                  {movie.title}
                </h3>
                <p className="text-sm font-serif text-muted-foreground mb-2">
                  {movie.genre}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-serif">{movie.duration} min</span>
                  </div>
                  <span className="px-2 py-1 border rounded text-xs">
                    {movie.rating}
                  </span>
                </div>
                <p className="text-sm font-serif text-muted-foreground mt-2">
                  {movie.showtimes.length} showtimes available
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
