/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";
import { getHumanDate, getHumanTime, getImageUrl } from "../../../utils";
import { Calendar, Clock, MapPin } from "lucide-react";

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
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-16 bg-stone-200 rounded-xl overflow-hidden shrink-0 shadow-2xs">
            <img
              src={getImageUrl(movie.poster_url || movie.poster)}
              className="w-full h-full object-cover"
              alt={movie.title}
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-stone-900">
              Select Showtime
            </h2>
            <p className="text-sm text-stone-500">
              Showing for{" "}
              <span className="text-[#c77e3b] font-bold">{movie.title}</span>
            </p>
          </div>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          size="xs"
          title="← Change Movie"
        />
      </div>

      {movie.showtimes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#c77e3b]/30">
          <Calendar className="w-10 h-10 text-[#c77e3b] mx-auto mb-3 opacity-60" />
          <p className="text-stone-700 font-bold">
            No showtimes scheduled for this movie
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Schedule a showtime in Movies & Showtimes first.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {movie.showtimes.map((showtime: any) => (
            <div
              key={showtime.showtime_id || showtime.id}
              className="group cursor-pointer bg-white border border-[#c77e3b]/15 rounded-2xl hover:shadow-xl hover:border-[#c77e3b] transition-all duration-300 p-5 flex flex-col justify-between hover:-translate-y-0.5"
              onClick={() => onSelect(showtime)}
            >
              <div className="flex justify-between items-start gap-2 mb-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#fff8ea] border border-[#c77e3b]/25 rounded-xl text-[#754f2c] font-extrabold text-base group-hover:bg-[#c77e3b] group-hover:text-white transition-colors">
                  <Clock className="w-4 h-4" />
                  {getHumanTime(showtime.show_time)}
                </div>
                <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
                  {getHumanDate(showtime.show_date)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                  <MapPin className="w-4 h-4 text-[#c77e3b] shrink-0" />
                  <span className="truncate">
                    {showtime.screen?.cinema?.name} ·{" "}
                    <strong className="text-stone-800">
                      {showtime.screen?.name}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[75%]" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    Seats Open
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
            className="text-[#c77e3b] cursor-pointer text-sm font-bold hover:underline"
          >
            Load More Showtimes...
          </button>
        </div>
      )}
    </div>
  );
}
