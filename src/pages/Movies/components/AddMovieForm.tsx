/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import { ImageIcon } from "lucide-react";
import ReusableSelect from "../../../components/shared/Select";
import { addMovieValidationSchema } from "../../../validations";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { toast } from "react-toastify";
import {
  createMovie,
  getAllMovies,
  updateMovie,
} from "../../../store/slices/movie";
import TextArea from "../../../components/shared/TextArea";

interface AddMovieProps {
  onCancel: () => void;
  editMode?: boolean;
  movieData?: any;
}

const AddMovieForm = ({ editMode, movieData, onCancel }: AddMovieProps) => {
  const dispatch = useAppDispatch();
  const { classifications } = useAppSelector((state) => state.classification);

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
    genres: movieData?.genres || [""],
    rating: movieData?.rating || "",
    release_date: movieData?.release_date || "",
    director: movieData?.director || "",
    cast: movieData?.cast || [""],
    poster_url: movieData?.poster_url || "",
    trailer_url: movieData?.trailer_url || "",
    language: movieData?.language || "",
    movie_classification_id: movieData?.movie_classification_id || "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response;
      const formattedValues = {
        ...values,
        duration: parseInt(values.duration),
        rating: parseInt(values.rating),
        cast: values.cast.filter((actor: any) => actor.trim() !== ""),
      };
      if (editMode && movieData?.movie_id) {
        delete formattedValues.movie_classification_id;
        response = await dispatch(
          updateMovie({
            id: movieData.movie_id,
            data: formattedValues,
          })
        ).unwrap();
      } else {
        const formattedValues = {
          ...values,
          duration: parseInt(values.duration),
          rating: values.rating ? parseFloat(values.rating) : 0,
          cast: values.cast.filter((actor: any) => actor.trim() !== ""),
        };
        response = await dispatch(createMovie(formattedValues)).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllMovies());
        resetForm();
        onCancel(); // close modal after success
      }
    } catch (error: any) {
      console.error("Error submitting screen form", error);
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
      }) => (
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Movie Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && errors.title ? errors.title : ""}
                placeholder="Enter movie title"
                required
              />

              <Input
                label="Director"
                name="director"
                value={values.director}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.director && errors.director ? errors.director : ""
                }
                placeholder="e.g., Christopher Nolan"
                required
              />

              <div>
                <label className="block font-medium md:text-lg mb-2">
                  Genres <span className="text-red-500">*</span>
                </label>
                {values.genres.map((genre: string, index: number) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      name={`genres.${index}`}
                      value={genre}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Genre ${index + 1}`}
                    />
                    {values.genres.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newGenre = values.genres.filter(
                            (_: unknown, i: number) => i !== index
                          );
                          setFieldValue("genres", newGenre);
                        }}
                        title="Remove"
                        className="px-3"
                      />
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFieldValue("genres", [...values.genres, ""])
                  }
                  title="+ Add Genre"
                  className="mt-2"
                />
                {touched.genres && errors.genres && (
                  <p className="text-sm text-red-500 italic mt-1">
                    {errors.genres}
                  </p>
                )}
              </div>

              {/*<Input
                label="Genre"
                name="genre"
                value={values.genre}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.genre && errors.genre ? errors.genre : ""}
                placeholder="e.g., Sci-Fi"
                required
              />*/}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.duration && typeof errors.duration === "string"
                      ? errors.duration
                      : undefined
                  }
                  placeholder="148"
                  required
                />

                <Input
                  label="Rating"
                  name="rating"
                  value={values.rating}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.rating && typeof errors.duration === "string"
                      ? errors.duration
                      : undefined
                  }
                  placeholder="8.8"
                  required
                />
              </div>

              <Input
                label="Release Date"
                name="release_date"
                type="date"
                value={values.release_date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.release_date &&
                  typeof errors.release_date === "string"
                    ? errors.release_date
                    : undefined
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <ReusableSelect
                  label="Language"
                  name="language"
                  value={values.language}
                  onChange={(value) => setFieldValue("language", value)}
                  options={languageOptions}
                  defaultOption="Select language"
                  error={
                    touched.language && typeof errors.language === "string"
                      ? errors.language
                      : undefined
                  }
                  required
                />

                <ReusableSelect
                  label="Classification"
                  name="movie_classification_id"
                  value={values.movie_classification_id}
                  onChange={(value) =>
                    setFieldValue("movie_classification_id", value)
                  }
                  options={allClassification}
                  defaultOption="Select classification"
                  error={
                    touched.movie_classification_id &&
                    typeof errors.movie_classification_id === "string"
                      ? errors.movie_classification_id
                      : undefined
                  }
                  required
                  disabled={editMode}
                />
              </div>

              <div>
                <label className="block font-medium md:text-lg mb-2">
                  Cast <span className="text-red-500">*</span>
                </label>
                {values.cast.map((actor: string, index: number) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      name={`cast.${index}`}
                      value={actor}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Actor ${index + 1}`}
                    />
                    {values.cast.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newCast = values.cast.filter(
                            (_: unknown, i: number) => i !== index
                          );
                          setFieldValue("cast", newCast);
                        }}
                        title="Remove"
                        className="px-3"
                      />
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFieldValue("cast", [...values.cast, ""])}
                  title="+ Add Actor"
                  className="mt-2"
                />
                {touched.cast && errors.cast && (
                  <p className="text-sm text-red-500 italic mt-1">
                    {errors.cast}
                  </p>
                )}
              </div>

              <div>
                <TextArea
                  label="Description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter movie description"
                  rows={3}
                  className={`w-full p-2 border rounded-md ${
                    touched.description && errors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                  error={
                    touched.description &&
                    typeof errors.description === "string"
                      ? errors.description
                      : undefined
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium md:text-lg mb-2">
                  Movie Poster
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drop poster image here or click to browse
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    title="Browse Files"
                  />
                </div>
              </div>

              <Input
                label="Poster URL"
                name="poster_url"
                value={values.poster_url}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.poster_url && typeof errors.poster_url
                    ? errors.poster_url
                    : undefined
                }
                placeholder="https://example.com/poster.jpg"
                required
              />

              <Input
                label="Trailer URL"
                name="trailer_url"
                value={values.trailer_url}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.trailer_url && errors.trailer_url === "string"
                    ? errors.trailer_url
                    : ""
                }
                placeholder="https://youtube.com/watch?v=example"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={
                isSubmitting
                  ? editMode
                    ? "Updating Movie..."
                    : "Adding Movie..."
                  : editMode
                  ? "Update Movie"
                  : "Add Movie"
              }
            />
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              title="Cancel"
              className="rounded-md"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddMovieForm;
