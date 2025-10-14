import * as Yup from "yup";

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

// export const addMovieValidationSchema = Yup.object({
//   title: Yup.string()
//     .required("Movie title is required")
//     .min(2, "Title must be at least 2 characters"),
//   genre: Yup.string().required("Genre is required"),
//   duration: Yup.number()
//     .required("Duration is required")
//     .min(1, "Duration must be at least 1 minute")
//     .max(500, "Duration cannot exceed 500 minutes"),
//   rating: Yup.string().required("Rating is required"),
//   releaseDate: Yup.date().required("Release date is required"),
//   description: Yup.string()
//     .required("Description is required")
//     .min(10, "Description must be at least 10 characters")
//     .max(1000, "Description cannot exceed 1000 characters"),
//   status: Yup.string().required("Status is required"),
//   imdbRating: Yup.number()
//     .min(0, "Rating must be between 0 and 10")
//     .max(10, "Rating must be between 0 and 10"),
// });

export const addMovieValidationSchema = Yup.object({
  title: Yup.string()
    .required("Movie title is required")
    .min(2, "Title must be at least 2 characters"),
  director: Yup.string()
    .required("Director is required")
    .min(2, "Director name must be at least 2 characters"),
  genre: Yup.string().required("Genre is required"),
  duration: Yup.number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute")
    .max(500, "Duration cannot exceed 500 minutes"),
  rating: Yup.string()
    .required("Rating is required")
    .matches(/^\d+(\.\d+)?\/10$/, "Rating must be in format: X.X/10"),
  release_date: Yup.date().required("Release date is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  cast: Yup.array()
    .of(Yup.string().min(2, "Actor name must be at least 2 characters"))
    .min(1, "At least one cast member is required")
    .required("Cast is required"),
  poster_url: Yup.string()
    // .required("Poster URL is required")
    .url("Must be a valid URL"),
  trailer_url: Yup.string().url("Must be a valid URL"),
  language: Yup.string().required("Language is required"),
  movie_classification_id: Yup.string().required("Classification is required"),
});

export const showTimeValidationSchema = Yup.object({
  movieTitle: Yup.string().required("Movie selection is required"),
  theater: Yup.string().required("Theater selection is required"),
  screen: Yup.string().required("Screen selection is required"),
  date: Yup.date()
    .required("Date is required")
    .min(new Date(), "Date cannot be in the past"),
  time: Yup.string().required("Time is required"),
  price: Yup.number()
    .required("Price is required")
    .min(0.01, "Price must be greater than 0")
    .max(100, "Price cannot exceed $100"),
});

export const theaterValidationSchema = Yup.object({
  name: Yup.string()
    .required("Theater name is required")
    .min(2, "Name must be at least 2 characters"),
  location: Yup.string()
    .required("Location is required")
    .min(3, "Location must be at least 3 characters"),
});

export const movieClassificationSchema = Yup.object().shape({
  name: Yup.string().required("Classification name is required"),
});

export const seatTypeValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  // description: Yup.string().required("Description is required"),
  // price: Yup.string().required("Price is required"),
});

export const showtimeStatusSchema = Yup.object().shape({
  name: Yup.string().required("Status name is required"),
});

export const screenValidationSchema = Yup.object().shape({
  cinema_id: Yup.string().required("Cinema is required"),
  name: Yup.string().required("Screen Name is required"),
  seat_layout: Yup.object().shape({
    rows: Yup.array()
      .of(
        Yup.object().shape({
          row: Yup.string()
            .trim()
            .required("Row label is required (e.g., A, B, C)"),
          count: Yup.number()
            .typeError("Seat count must be a number")
            .min(1, "Each row must have at least 1 seat")
            .required("Seat count is required"),
          default_type: Yup.string().required("Default seat type is required"),
        })
      )
      .min(1, "At least one row is required")
      .required("Seat layout is required"),
  }),
});
