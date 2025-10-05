export default function MoviesReports() {
  const moviePerformanceData = [
    { movie: "Spider-Man", revenue: 45000, tickets: 1800, rating: 4.5 },
    { movie: "Dune: Part Two", revenue: 38000, tickets: 1520, rating: 4.7 },
    { movie: "The Batman", revenue: 32000, tickets: 1280, rating: 4.3 },
    { movie: "Top Gun", revenue: 28000, tickets: 1120, rating: 4.6 },
    { movie: "Avatar", revenue: 25000, tickets: 1000, rating: 4.4 },
  ];

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-sans font-semibold text-lg mb-2">
        Movie Performance
      </h3>
      <p className="text-sm text-muted-foreground font-serif mb-4">
        Revenue and ticket sales by movie
      </p>
      <div className="space-y-4">
        {moviePerformanceData.map((movie, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-muted rounded-lg"
          >
            <div>
              <h4 className="font-serif font-medium">{movie.movie}</h4>
              <p className="font-serif text-sm text-muted-foreground">
                {movie.tickets.toLocaleString()} tickets sold
              </p>
            </div>
            <div className="text-right">
              <p className="font-sans font-bold">
                ${movie.revenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1">
                <span className="font-serif text-sm">★ {movie.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
