/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import Button from "../../../components/shared/Button";
import { Tag } from "antd";
import { Edit, Play, Clock, Star } from "lucide-react";

const Movies = ({ movies }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {movies.map((movie: any) => (
        <Card
          key={movie.id}
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="aspect-[2/3] relative">
            <img
              src={movie.poster || "/placeholder.svg"}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <Tag
              className="absolute top-2 right-2"
              color={movie.status === "Now Playing" ? "green" : "blue"}
            >
              {movie.status}
            </Tag>
          </div>
          <CardHeader>
            <CardTitle className="font-sans text-lg">{movie.title}</CardTitle>
            <CardDescription className="font-serif">
              {movie.genre}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-serif">{movie.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-serif">{movie.imdbRating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tag color="orange">{movie.rating}</Tag>
                <span className="text-sm font-serif text-muted-foreground">
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </span>
              </div>
              <div className="h-20">
                {movie.showtimes.length > 0 && (
                  <div className="">
                    <p className="text-sm font-serif text-muted-foreground mb-2">
                      Today's Showtimes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {movie.showtimes.slice(0, 3).map((time: any) => (
                        <Tag key={time} color="blue" className="text-xs">
                          {time}
                        </Tag>
                      ))}
                      {movie.showtimes.length > 3 && (
                        <Tag color="blue" className="text-xs">
                          +{movie.showtimes.length - 3} more
                        </Tag>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 gap-2 rounded-md"
                  icon={<Edit className="w-3 h-3" />}
                  title="Edit"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-md"
                  icon={<Play className="w-3 h-3" />}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Movies;
