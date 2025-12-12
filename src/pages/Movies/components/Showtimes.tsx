/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "../../../components/shared/Cards";
import Button from "../../../components/shared/Button";
import { Edit, Trash2, Users } from "lucide-react";
import Loader from "../../../components/shared/Loader";
import { getHumanDate, getHumanTime } from "../../../utils";

const Showtimes = ({ showtimes, loading }: any) => {
  return (
    <div className="space-y-4">
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {showtimes.map((showtime: any) => (
            <Card key={showtime.showtime_id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-sans font-semibold text-lg">
                    {showtime.movie.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-serif">
                      {showtime.screen.cinema.name} • {showtime.screen.name}
                    </span></div>
                    <p className="font-serif">
                      {getHumanDate(showtime.show_date)} at {getHumanTime(showtime.show_time)}
                    </p>
                    {/* <span className="font-serif">{formatCurrency(showtime.price)}</span> */}
                  
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-serif text-sm">
                      {showtime.availableSeats}/{showtime.totalSeats} available
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-2 rounded-md"
                      icon={<Edit className="w-3 h-3" />}
                      title="Edit"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-md"
                      icon={<Trash2 className="w-3 h-3" />}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
        ))}
        </div>
        
      )}
    </div>
  );
};

export default Showtimes;
