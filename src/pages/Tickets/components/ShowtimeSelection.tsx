/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";
import { getHumanDate, getHumanTime, getImageUrl } from "../../../utils";
import { Calendar, MapPin } from "lucide-react";

interface ShowtimeSelectionProps {
  movie: any;
  onSelect: (showtime: any) => void;
  onBack: () => void;
  totalShowtimes: number;
  onLoadMore: () => void;
}

export default function ShowtimeSelection({
  movie,
  onSelect,
  onBack,
  totalShowtimes,
  onLoadMore,
}: ShowtimeSelectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <Button
          onClick={onBack}
          variant="outline"
          title="← Back"
          className="rounded-full w-fit hover:bg-muted"
        />
        <div className="flex gap-4 items-center">
            <div className="w-12 h-16 bg-muted rounded-md overflow-hidden shrink-0">
                <img src={getImageUrl(movie.poster_url || movie.poster)} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
                 <h2 className="text-2xl font-sans font-bold text-foreground">
                    Select Showtime
                </h2>
                <p className="text-sm text-muted-foreground font-serif">For <span className="text-foreground font-bold">{movie.title}</span></p>
            </div>
        </div>
      </div>

      {movie.showtimes.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground font-serif">No showtimes scheduled for this movie.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movie.showtimes.map((showtime: any) => (
            <div
                key={showtime.showtime_id || showtime.id}
                className="group cursor-pointer bg-card border rounded-2xl hover:shadow-xl hover:border-primary/50 transition-all duration-300 p-6 flex flex-col justify-between"
                onClick={() => onSelect(showtime)}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg- rounded-xl text- font-sans font-black text-lg transition-colors">
                        {getHumanTime(showtime.show_time)} • {getHumanDate(showtime.show_date)}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-serif">
                        <MapPin className="w-4 h-4 text-" />
                        <span>{showtime.screen?.cinema?.name} • {showtime.screen?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[70%]" /> {/* Dummy occupancy */}
                        </div>
                        <span className="text-[10px] font-sans font-bold text-green-600 uppercase tracking-widest leading-none">
                            Available
                        </span>
                    </div>
                </div>
            </div>
            ))}
        </div>
      )}

      {movie.showtimes.length < totalShowtimes && (
          <div className="flex justify-center pt-4">
            <button
              onClick={onLoadMore}
              className="text- cursor-pointer font-bold hover:underline"
            >
              Load More Showtimes...
            </button>
          </div>
        )}
    </div>
  );
}
