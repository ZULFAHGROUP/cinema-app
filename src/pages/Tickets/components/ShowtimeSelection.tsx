/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";

interface ShowtimeSelectionProps {
  movie: any;
  onSelect: (showtime: any) => void;
  onBack: () => void;
}

export default function ShowtimeSelection({
  movie,
  onSelect,
  onBack,
}: ShowtimeSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          title="← Back"
          className="rounded-md"
        />
        <h2 className="text-xl font-sans font-semibold">
          Select Showtime - {movie.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {movie.showtimes.map((showtime: any) => (
          <div
            key={showtime.id}
            className="cursor-pointer border rounded-lg hover:shadow-md transition-shadow p-4"
            onClick={() => onSelect(showtime)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-semibold text-lg">
                  {showtime.time}
                </p>
                <p className="text-sm font-serif text-muted-foreground">
                  {showtime.theater} • {showtime.screen}
                </p>
                <p className="text-sm font-serif text-muted-foreground">
                  {showtime.available} seats available
                </p>
              </div>
              <div className="text-right">
                <p className="font-sans font-semibold text-lg">
                  ${showtime.price}
                </p>
                <p className="text-sm font-serif text-muted-foreground">
                  per ticket
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
