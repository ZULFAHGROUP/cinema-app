/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import { Film, ImagePlus, Clock, Star } from "lucide-react";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import TextArea from "../../../components/shared/TextArea";
import { addMovieValidationSchema } from "../../../validations";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { toast } from "react-toastify";
import {
  createMovie,
  getAllMovies,
  updateMovie,
} from "../../../store/slices/movie";
import Movie from "../../../services/network/movie";
import TagInput from "../../../components/shared/TagInput";

interface AddMovieProps {
  onCancel: () => void;
  editMode?: boolean;
  movieData?: any;
}

const GENRE_SUGGESTIONS = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Horror",
  "Animation",
  "Romance",
];

const AddMovieForm = ({ editMode, movieData, onCancel }: AddMovieProps) => {
  const dispatch = useAppDispatch();
  const { classifications } = useAppSelector((state) => state.classification);
  const {
    limit,
    page,
    filters: movieFilters,
  } = useAppSelector((state) => state.movie);

  const allClassification = [...(classifications || [])]
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
    .map((seats: { movie_classification_id: string; name: string }) => ({
      label: seats.name,
      value: seats.movie_classification_id,
    }));

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "Chinese", label: "Chinese" },
  ];

  const initialValues = {
    title: movieData?.title || "",
    description: movieData?.description || "",
    duration: movieData?.duration || "",
    genres: movieData?.genres
      ? Array.isArray(movieData.genres)
        ? movieData.genres
        : movieData.genres.split(",").map((g: string) => g.trim())
      : [],
    rating: movieData?.rating || "",
    release_date: movieData?.release_date
      ? new Date(movieData.release_date).toISOString().split("T")[0]
      : "",
    director: movieData?.director || "",
    cast: movieData?.cast
      ? Array.isArray(movieData.cast)
        ? movieData.cast
        : movieData.cast.split(",").map((c: string) => c.trim())
      : [],
    poster: null as File | null,
    language: movieData?.language || "",
    movie_classification_id: movieData?.movie_classification_id || "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response;
      let poster_temp_upload_id: string | undefined;

      if (values.poster instanceof File) {
        const uploadRes = await Movie.uploadPoster(values.poster);
        poster_temp_upload_id = uploadRes.data?.data?.temp_upload_id;
      }

      const payload: Record<string, any> = {
        title: values.title,
        director: values.director,
        duration: Number(values.duration),
        rating: values.rating.toString(),
        release_date: values.release_date,
        language: values.language,
        description: values.description,
        genres: values.genres.join(","),
        cast: values.cast.join(","),
        ...(poster_temp_upload_id ? { poster_temp_upload_id } : {}),
      };

      if (!editMode) {
        payload.movie_classification_id = values.movie_classification_id;
      }

      if (editMode && movieData?.movie_id) {
        response = await dispatch(
          updateMovie({
            id: movieData.movie_id,
            data: payload,
          })
        ).unwrap();
      } else {
        response = await dispatch(createMovie(payload)).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllMovies({ page, limit, filters: movieFilters }));
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      console.error("Error submitting movie form", error);
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addMovieValidationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
        handleSubmit,
      }) => {
        const durationNum = Number(values.duration) || 0;
        const durationFormatted =
          durationNum >= 60
            ? `${Math.floor(durationNum / 60)}h ${durationNum % 60}m`
            : durationNum > 0
            ? `${durationNum}m`
            : null;

        const posterPreviewUrl =
          values.poster instanceof File
            ? URL.createObjectURL(values.poster)
            : movieData?.poster_url || movieData?.poster || null;

        return (
          <Form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* LEFT COLUMN: Movie Metadata */}
              <div className="md:col-span-7 space-y-4">
                <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 px-3.5 py-2.5 flex items-center gap-2.5">
                  <Film size={16} className="text-[#c77e3b] shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                    Movie Details & Credits
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <Input
                    label="Movie Title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title ? (errors.title as string) : ""}
                    placeholder="e.g., Inception"
                    required
                  />

                  <Input
                    label="Director"
                    name="director"
                    value={values.director}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.director ? (errors.director as string) : ""}
                    placeholder="e.g., Christopher Nolan"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <Input
                    label="Duration (Mins)"
                    name="duration"
                    type="number"
                    value={values.duration}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.duration ? (errors.duration as string) : ""}
                    placeholder="148"
                    hint={
                      durationFormatted
                        ? `Runtime: ${durationFormatted}`
                        : "In minutes"
                    }
                    prefix={<Clock size={14} className="text-stone-400 mr-1" />}
                    required
                  />

                  <Input
                    label="Rating (0 - 10)"
                    name="rating"
                    value={values.rating}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.rating ? (errors.rating as string) : ""}
                    placeholder="8.8"
                    prefix={<Star size={14} className="text-amber-500 mr-1" />}
                    required
                  />

                  <Input
                    label="Release Date"
                    name="release_date"
                    type="date"
                    value={values.release_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.release_date
                        ? (errors.release_date as string)
                        : ""
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <ReusableSelect
                    label="Audio Language"
                    name="language"
                    value={values.language}
                    onChange={(value) => setFieldValue("language", value)}
                    options={languageOptions}
                    defaultOption="Select language"
                    error={touched.language ? (errors.language as string) : ""}
                    required
                  />

                  <ReusableSelect
                    label="Age Classification"
                    name="movie_classification_id"
                    value={values.movie_classification_id}
                    onChange={(value) =>
                      setFieldValue("movie_classification_id", value)
                    }
                    options={allClassification}
                    defaultOption="Select rating (PG, 18+...)"
                    error={
                      touched.movie_classification_id
                        ? (errors.movie_classification_id as string)
                        : ""
                    }
                    required
                    disabled={editMode}
                  />
                </div>

                <TagInput
                  label="Genres"
                  name="genres"
                  values={values.genres}
                  setFieldValue={setFieldValue}
                  error={errors.genres as string}
                  touched={Boolean(touched.genres)}
                  placeholder="Type a genre and press Enter..."
                  suggestions={GENRE_SUGGESTIONS}
                  required
                />

                <TagInput
                  label="Main Cast"
                  name="cast"
                  values={values.cast}
                  setFieldValue={setFieldValue}
                  error={errors.cast as string}
                  touched={Boolean(touched.cast)}
                  placeholder="Type actor name and press Enter..."
                  hint="Press Enter or comma after each actor name"
                  required
                />
              </div>

              {/* RIGHT COLUMN: Poster Upload & Synopsis */}
              <div className="md:col-span-5 space-y-4 flex flex-col">
                <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 px-3.5 py-2.5 flex items-center gap-2.5">
                  <ImagePlus size={16} className="text-[#c77e3b] shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                    Poster & Synopsis
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Movie Poster Artwork{" "}
                    {!editMode && <span className="text-[#c77e3b]">*</span>}
                  </label>
                  <label className="group relative flex flex-col items-center justify-center w-full h-52 rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#c77e3b] bg-stone-50/70 hover:bg-[#fff8ea]/40 transition-all cursor-pointer overflow-hidden">
                    {posterPreviewUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-stone-900">
                        <img
                          src={posterPreviewUrl}
                          alt="Poster preview"
                          className="h-full w-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-3 text-center">
                          <ImagePlus className="w-6 h-6 mb-1 text-[#c77e3b]" />
                          <span className="text-xs font-semibold">
                            Click to replace poster
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-11 h-11 rounded-xl bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                          <ImagePlus size={22} />
                        </div>
                        <p className="text-xs font-semibold text-stone-700">
                          Click to upload movie poster
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          PNG, JPG or WEBP (Portrait 2:3 recommended)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      name="poster"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setFieldValue("poster", file || null);
                      }}
                    />
                  </label>
                  {values.poster instanceof File && (
                    <p className="mt-1.5 text-xs text-emerald-700 font-medium truncate">
                      Selected: {values.poster.name} (
                      {(values.poster.size / 1024).toFixed(0)} KB)
                    </p>
                  )}
                  {touched.poster && errors.poster && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.poster as string}
                    </p>
                  )}
                </div>

                <TextArea
                  label="Movie Synopsis / Description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Write a brief plot summary shown on the POS and movie details..."
                  rows={5}
                  required
                  error={
                    touched.description ? (errors.description as string) : ""
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-stone-200/80">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                title="Cancel"
              />
              <Button
                type="submit"
                className="min-w-[160px]"
                disabled={isSubmitting}
                loading={isSubmitting}
                title={
                  isSubmitting
                    ? editMode
                      ? "Updating Movie..."
                      : "Adding Movie..."
                    : editMode
                    ? "Save Movie Changes"
                    : "Create Movie"
                }
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddMovieForm;
