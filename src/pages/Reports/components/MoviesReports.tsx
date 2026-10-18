import { SalesReport } from "../../../hooks/useSalesReport";
import { formatCurrency } from "../../../utils";

export default function MoviesReports({ report }: { report: SalesReport }) {
  const topRevenue = report.movies[0]?.revenue || 0;

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-sans font-semibold text-lg mb-1">Movie Performance</h3>
      <p className="text-sm text-muted-foreground font-serif mb-4">
        Top movies by ticket revenue (before VAT)
      </p>
      {report.movies.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No ticket sales in this period.</p>
      ) : (
        <div className="space-y-3">
          {report.movies.map((movie, index) => (
            <div key={movie.movie_id} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-medium">
                    {index + 1}. {movie.title}
                  </h4>
                  <p className="font-serif text-sm text-muted-foreground">
                    {movie.tickets_sold.toLocaleString()} tickets sold
                  </p>
                </div>
                <p className="font-sans font-bold">{formatCurrency(movie.revenue)}</p>
              </div>
              <div className="h-1.5 bg-white rounded mt-2">
                <div
                  className="h-1.5 bg-[#c77e3b] rounded"
                  style={{ width: `${topRevenue ? (movie.revenue / topRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
