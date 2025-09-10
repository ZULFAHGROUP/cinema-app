import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/shared/Cards";
import Button from "../../components/shared/Button";
import {
  Film,
  Plus,
  Edit,
  Trash2,
  Star,
  Clock,
  Calendar,
  Users,
  Play,
  ImageIcon,
} from "lucide-react";

function MoviesPage() {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Spider-Man: No Way Home",
      genre: "Action/Adventure",
      duration: 148,
      rating: "PG-13",
      imdbRating: 8.4,
      releaseDate: "2021-12-17",
      status: "Now Playing",
      poster: "/spider-man-movie-poster.png",
      showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
    },
    {
      id: 2,
      title: "Dune: Part Two",
      genre: "Sci-Fi/Drama",
      duration: 166,
      rating: "PG-13",
      imdbRating: 8.8,
      releaseDate: "2024-03-01",
      status: "Now Playing",
      poster: "/dune-part-two-poster.png",
      showtimes: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
    },
    {
      id: 3,
      title: "The Batman",
      genre: "Action/Crime",
      duration: 176,
      rating: "PG-13",
      imdbRating: 7.8,
      releaseDate: "2022-03-04",
      status: "Coming Soon",
      poster: "/images/posters/the-batman-poster.png",
      showtimes: [],
    },
  ]);

  const [showtimes, setShowtimes] = useState([
    {
      id: 1,
      movieTitle: "Spider-Man: No Way Home",
      theater: "Theater 1",
      screen: "Screen A",
      time: "10:00 AM",
      date: "2024-01-15",
      availableSeats: 120,
      totalSeats: 150,
      price: 12.99,
    },
    {
      id: 2,
      movieTitle: "Dune: Part Two",
      theater: "Theater 2",
      screen: "Screen B",
      time: "2:30 PM",
      date: "2024-01-15",
      availableSeats: 180,
      totalSeats: 200,
      price: 15.99,
    },
  ]);

  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [isAddingShowtime, setIsAddingShowtime] = useState(false);

  return (
    <div className="">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-sans font-bold text-foreground">
              Movie Management
            </h1>
            <p className="text-sm text-muted-foreground font-serif">
              Manage movies, showtimes, and ratings
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddingShowtime} onOpenChange={setIsAddingShowtime}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Calendar className="w-4 h-4" />
                  Add Showtime
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-sans">
                    Add New Showtime
                  </DialogTitle>
                  <DialogDescription className="font-serif">
                    Schedule a new movie showing
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="movie-select" className="font-serif">
                      Movie
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select movie" />
                      </SelectTrigger>
                      <SelectContent>
                        {movies.map((movie) => (
                          <SelectItem
                            key={movie.id}
                            value={movie.id.toString()}
                          >
                            {movie.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theater-select" className="font-serif">
                        Theater
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theater" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="theater1">Theater 1</SelectItem>
                          <SelectItem value="theater2">Theater 2</SelectItem>
                          <SelectItem value="theater3">Theater 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="screen-select" className="font-serif">
                        Screen
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select screen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="screena">Screen A</SelectItem>
                          <SelectItem value="screenb">Screen B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="showtime-date" className="font-serif">
                        Date
                      </Label>
                      <Input id="showtime-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="showtime-time" className="font-serif">
                        Time
                      </Label>
                      <Input id="showtime-time" type="time" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="ticket-price" className="font-serif">
                      Ticket Price
                    </Label>
                    <Input
                      id="ticket-price"
                      type="number"
                      step="0.01"
                      placeholder="12.99"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Create Showtime</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingShowtime(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddingMovie} onOpenChange={setIsAddingMovie}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Movie
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-sans">Add New Movie</DialogTitle>
                  <DialogDescription className="font-serif">
                    Add a new movie to your cinema catalog
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="movie-title" className="font-serif">
                        Movie Title
                      </Label>
                      <Input id="movie-title" placeholder="Enter movie title" />
                    </div>
                    <div>
                      <Label htmlFor="movie-genre" className="font-serif">
                        Genre
                      </Label>
                      <Input id="movie-genre" placeholder="Action/Adventure" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="movie-duration" className="font-serif">
                          Duration (min)
                        </Label>
                        <Input
                          id="movie-duration"
                          type="number"
                          placeholder="120"
                        />
                      </div>
                      <div>
                        <Label htmlFor="movie-rating" className="font-serif">
                          Rating
                        </Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="g">G</SelectItem>
                            <SelectItem value="pg">PG</SelectItem>
                            <SelectItem value="pg13">PG-13</SelectItem>
                            <SelectItem value="r">R</SelectItem>
                            <SelectItem value="nc17">NC-17</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="release-date" className="font-serif">
                        Release Date
                      </Label>
                      <Input id="release-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="movie-description" className="font-serif">
                        Description
                      </Label>
                      <Textarea
                        id="movie-description"
                        placeholder="Enter movie description"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="font-serif">Movie Poster</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm font-serif text-muted-foreground mb-2">
                          Drop poster image here or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Browse Files
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Add Movie</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingMovie(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="movies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="movies" className="gap-2">
              <Film className="w-4 h-4" />
              Movies
            </TabsTrigger>
            <TabsTrigger value="showtimes" className="gap-2">
              <Calendar className="w-4 h-4" />
              Showtimes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
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
                    <Badge
                      className="absolute top-2 right-2"
                      variant={
                        movie.status === "Now Playing" ? "default" : "secondary"
                      }
                    >
                      {movie.status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-sans text-lg">
                      {movie.title}
                    </CardTitle>
                    <CardDescription className="font-serif">
                      {movie.genre}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-serif">
                            {movie.duration} min
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-serif">{movie.imdbRating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{movie.rating}</Badge>
                        <span className="text-sm font-serif text-muted-foreground">
                          {new Date(movie.releaseDate).toLocaleDateString()}
                        </span>
                      </div>
                      {movie.showtimes.length > 0 && (
                        <div>
                          <p className="text-sm font-serif text-muted-foreground mb-2">
                            Today's Showtimes
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {movie.showtimes.slice(0, 3).map((time) => (
                              <Badge
                                key={time}
                                variant="secondary"
                                className="text-xs"
                              >
                                {time}
                              </Badge>
                            ))}
                            {movie.showtimes.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{movie.showtimes.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Edit className="w-3 h-3" />}
                          className="flex-1 gap-2 bg-transparent"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="showtimes" className="space-y-6">
            <div className="space-y-4">
              {showtimes.map((showtime) => (
                <Card key={showtime.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-sans font-semibold text-lg">
                          {showtime.movieTitle}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-serif">
                            {showtime.theater} • {showtime.screen}
                          </span>
                          <span className="font-serif">
                            {showtime.date} at {showtime.time}
                          </span>
                          <span className="font-serif">${showtime.price}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-serif text-sm">
                            {showtime.availableSeats}/{showtime.totalSeats}{" "}
                            available
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-transparent"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-transparent"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default MoviesPage;
