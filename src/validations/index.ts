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
  // genres: Yup.string().required("Genres is required"),
  genres: Yup.array()
    .of(Yup.string().min(2, "Genre must be at least 2 characters"))
    .min(1, "At least one genre is required")
    .required("Cast is required"),
  duration: Yup.number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute")
    .max(500, "Duration cannot exceed 500 minutes"),
  rating: Yup.number().required("Rating is required"),
  release_date: Yup.date().required("Release date is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  // cast: Yup.string().required("Cast is required"),
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
  movie_id: Yup.string().required("Movie selection is required"),
  screen_id: Yup.string().required("Screen selection is required"),
  show_date: Yup.string().required("Show date is required"),
  show_time: Yup.string().required("Show start time is required"),
  showtime_status_id: Yup.string().required("Showtime status is required"),
  // price: Yup.number()
  //   .required("Price is required")
  //   .min(0.01, "Price must be greater than 0")
  //   .max(100, "Price cannot exceed $100"),
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
  screen_type_id: Yup.string().required("Screen type is required"),
  name: Yup.string().required("Screen Name is required"),
  seat_count: Yup.string().required("Seat count is required"),
});

export const roleSchema = Yup.object().shape({
  role_name: Yup.string().required("Role name is required"),
  description: Yup.string().required("Role description is required"),
});

export const resetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string().min(6).required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export const productCatSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

export const productSchema = Yup.object({
  name: Yup.string().required("Product name is required").min(2, "Too short"),
  product_category_id: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required").min(0.01, "Invalid amount"),
  // product_image: Yup.mixed().required("Product image is required"),
  product_image: Yup.string().required("Product image is required"),
  description: Yup.string(),
});

export const priceRuleSchema = Yup.object({
  name: Yup.string()
    .required("Price rule name is required")
    .min(2, "Name must be at least 2 characters"),
  price: Yup.number()
    .required("Price is required")
    .min(0.01, "Price must be greater than 0"),
  screen_type_id: Yup.string().required("Screen type is required"),
  movie_id: Yup.string().required("Movie is required"),
  priority: Yup.number()
    .required("Priority is required")
    .min(1, "Priority must be at least 1"),
  day_of_week: Yup.array()
    .of(Yup.number().min(0).max(6))
    .min(1, "At least one day must be selected")
    .required("Days of week are required"),
  start_time: Yup.string()
    .required("Start time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, "Invalid time format (HH:MM:SS)"),
  end_time: Yup.string()
    .required("End time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, "Invalid time format (HH:MM:SS)"),
  cinema_id: Yup.string(), // Optional - admins can leave empty for general rules
  product_ids: Yup.array()
    .of(Yup.string())
    .min(1, "At least one product must be selected")
    .required("Products are required"),
});

// Inventory operation schemas
export const inventoryOperationSchema = Yup.object({
  quantity: Yup.number()
    .required("Quantity is required")
    .min(1, "Quantity must be at least 1"),
  reason: Yup.string()
    .required("Reason is required")
    .min(3, "Reason must be at least 3 characters"),
});

export const transferOutSchema = Yup.object({
  quantity: Yup.number()
    .required("Quantity is required")
    .min(1, "Quantity must be at least 1"),
  reason: Yup.string()
    .required("Reason is required")
    .min(3, "Reason must be at least 3 characters"),
  destination_cinema_id: Yup.string().required("Destination cinema is required"),
});

export const transferInSchema = Yup.object({
  quantity: Yup.number()
    .required("Quantity is required")
    .min(1, "Quantity must be at least 1"),
  reason: Yup.string()
    .required("Reason is required")
    .min(3, "Reason must be at least 3 characters"),
  source_cinema_id: Yup.string().required("Source cinema is required"),
});

export const permissionSchema = Yup.object().shape({
  permission_name: Yup.string().required("Permission name is required"),
  description: Yup.string().required("Description is required"),
});

export const vatConfigSchema = Yup.object().shape({
  name: Yup.string().required("VAT name is required"),
  rate: Yup.number()
    .required("Rate is required")
    .min(0, "Rate must be at least 0")
    .max(1, "Rate cannot exceed 1"),
  is_global: Yup.boolean().required("Global status is required"),
  priority: Yup.number()
    .required("Priority is required")
    .min(1, "Priority must be at least 1"),
  effective_from: Yup.string().required("Effective from date is required"),
  effective_to: Yup.string().nullable(),
});

export const rolePermissionSchema = Yup.object().shape({
  role_id: Yup.string().required("Role is required"),
  permission_id: Yup.string().required("Permission is required"),
});


