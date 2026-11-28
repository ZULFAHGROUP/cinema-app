/* eslint-disable @typescript-eslint/no-explicit-any */
import { Clock, Ticket } from "lucide-react";
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
        <h2 className="text-xl font-extrabold text-stone-900">Select a Movie</h2>
        <span className="px-3 py-1 rounded-full bg-white border border-[#c77e3b]/20 text-xs font-bold text-[#754f2c]">
          {movies.length} Showing
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.movie_id}
            className="group cursor-pointer bg-white border border-[#c77e3b]/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#c77e3b] transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => onSelect(movie)}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-900">
              <img
                src={getImageUrl(movie.poster_url || movie.poster)}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c77e3b] text-white text-xs font-bold shadow-md">
                  <Ticket className="w-3.5 h-3.5" />
                  Book Tickets
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/90">
                  <Clock className="w-3.5 h-3.5 text-[#c77e3b]" />
                  {movie.duration || 120} min
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 bg-black/65 backdrop-blur-md text-white rounded-lg text-[11px] font-bold uppercase tracking-wider">
                  {movie.movie_classification?.name || movie.rating || "PG"}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-base text-stone-900 mb-1 group-hover:text-[#c77e3b] transition-colors line-clamp-1">
                {movie.title}
              </h3>
              <p className="text-xs text-stone-500 uppercase tracking-wide truncate">
                {movie.genres || ""}
              </p>
            </div>
          </div>
        ))}
      </div>

      {movies.length < totalMovies && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            className="text-[#c77e3b] cursor-pointer text-sm font-bold hover:underline"
          >
            Load More Movies...
          </button>
        </div>
      )}
    </div>
  );
}
