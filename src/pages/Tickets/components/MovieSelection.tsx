import { Clock, PlayCircle } from "lucide-react";
import { getImageUrl } from "../../../utils";

interface MovieSelectionProps {
  movies: any[];
  onSelect: (movie: any) => void;
  totalMovies: number;
  onLoadMore: () => void;
}

export default function MovieSelection({
  movies,
  onSelect,
  totalMovies,
  onLoadMore,
}: MovieSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-sans font-bold text-foreground">Select Movie</h2>
        <span className="text-sm text-muted-foreground font-serif">{movies.length} Movies Showing</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.movie_id}
            className="group cursor-pointer bg-card border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => onSelect(movie)}
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              <img
                src={getImageUrl(movie.poster_url || movie.poster)}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute top-3 right-3">
                 <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white rounded text-[10px] font-bold uppercase tracking-wider">
                    {movie.movie_classification.name || movie.rating || "PG"}
                 </span>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-sans font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {movie.title}
              </h3>
              <p className="text-xs font-serif text-muted-foreground mb-3 uppercase tracking-wide">
                {movie.genres || ""}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-4 border-t border-muted">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-serif">{movie.duration || 120} min</span>
                </div>
                {/* We can add showtime count here if we pass it down, but for now let's keep it simple */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {movies.length < totalMovies && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            className="text- cursor-pointer font-bold hover:underline"
          >
            Load More Movies...
          </button>
        </div>
      )}
    </div>
  );
}
