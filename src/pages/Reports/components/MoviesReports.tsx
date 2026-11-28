import { Film, Trophy } from "lucide-react";
import { SalesReport } from "../../../hooks/useSalesReport";
import { formatCurrency } from "../../../utils";

export default function MoviesReports({ report }: { report: SalesReport }) {
  const topRevenue = report.movies[0]?.revenue || 0;

  return (
    <div className="bg-white border border-[#e6dfd3] rounded-2xl p-6 shadow-[0_1px_2px_rgba(18,22,28,0.05)]">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#fff8ea] border border-[#e6dfd3] flex items-center justify-center text-[#c77e3b]">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-[#12161c]">
            Box Office Movie Leaderboard
          </h3>
          <p className="text-xs text-[#686259]">
            Top-performing films ranked by net ticket revenue (before VAT)
          </p>
        </div>
      </div>

      {report.movies.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-[#e6dfd3] bg-[#faf6ed]">
          <Film className="w-8 h-8 text-[#8a8275] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#12161c]">
            No ticket sales recorded in this period
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {report.movies.map((movie, index) => (
            <div
              key={movie.movie_id}
              className="p-4 bg-[#faf6ed] border border-[#e6dfd3] rounded-2xl"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      index === 0
                        ? "bg-[#c77e3b] text-white"
                        : "bg-white border border-[#e6dfd3] text-[#754f2c]"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-[#12161c] truncate">
                      {movie.title}
                    </h4>
                    <p className="text-xs text-[#686259]">
                      {movie.tickets_sold.toLocaleString()} tickets sold
                    </p>
                  </div>
                </div>
                <p className="font-display font-bold text-[#12161c] tabular-nums">
                  {formatCurrency(movie.revenue)}
                </p>
              </div>
              <div className="h-2 bg-white rounded-full mt-3 overflow-hidden border border-[#e6dfd3]">
                <div
                  className="h-full bg-[#c77e3b] rounded-full"
                  style={{
                    width: `${
                      topRevenue ? (movie.revenue / topRevenue) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
