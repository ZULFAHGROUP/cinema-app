import * as Yup from "yup";

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const addMovieValidationSchema = Yup.object({
  title: Yup.string()
    .required("Movie title is required")
    .min(2, "Title must be at least 2 characters"),
  genre: Yup.string().required("Genre is required"),
  duration: Yup.number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute")
    .max(500, "Duration cannot exceed 500 minutes"),
  rating: Yup.string().required("Rating is required"),
  releaseDate: Yup.date().required("Release date is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  status: Yup.string().required("Status is required"),
  imdbRating: Yup.number()
    .min(0, "Rating must be between 0 and 10")
    .max(10, "Rating must be between 0 and 10"),
});
