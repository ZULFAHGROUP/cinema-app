/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
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
import TagInput from "../../../components/shared/TagInput";

interface AddMovieProps {
  onCancel: () => void;
  editMode?: boolean;
  movieData?: any;
}

const AddMovieForm = ({ editMode, movieData, onCancel }: AddMovieProps) => {
  const dispatch = useAppDispatch();
  const { classifications } = useAppSelector((state) => state.classification);
  const { limit, page } = useAppSelector((state) => state.movie);

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
    poster: null,
    // trailer_url: movieData?.trailer_url || "",
    language: movieData?.language || "",
    movie_classification_id: movieData?.movie_classification_id || "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response;
      const formData = new FormData();

      // Append all fields to FormData
      formData.append("title", values.title);
      formData.append("director", values.director);
      formData.append("duration", values.duration.toString());
      formData.append("rating", values.rating.toString());
      formData.append("release_date", values.release_date);
      formData.append("language", values.language);
      formData.append("description", values.description);
      formData.append("genres", values.genres.join(","));
      formData.append("cast", values.cast.join(","));

      if (!editMode) {
        formData.append("movie_classification_id", values.movie_classification_id);
      }

      if (values.poster) {
        formData.append("poster", values.poster);
      }

      if (editMode && movieData?.movie_id) {
        response = await dispatch(
          updateMovie({
            id: movieData.movie_id,
            data: formData,
          })
        ).unwrap();
      } else {
        response = await dispatch(createMovie(formData)).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllMovies({ page, limit }));
        resetForm();
        onCancel();
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
                error={touched.title ? (errors.title as string) : ""}
                placeholder="Enter movie title"
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

              <TagInput
                label="Genres"
                name="genres"
                values={values.genres}
                setFieldValue={setFieldValue}
                error={errors.genres as string}
                // touched={touched.genres}
                placeholder="Type a genre and press Enter"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.duration ? (errors.duration as string) : ""}
                  placeholder="148"
                  required
                />

                <Input
                  label="Rating"
                  name="rating"
                  value={values.rating}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.rating ? (errors.rating as string) : ""}
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
                  touched.release_date ? (errors.release_date as string) : ""
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
                  error={touched.language ? (errors.language as string) : ""}
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
                    touched.movie_classification_id
                      ? (errors.movie_classification_id as string)
                      : ""
                  }
                  required
                  disabled={editMode}
                />
              </div>

              <TagInput
                label="Cast"
                name="cast"
                values={values.cast}
                setFieldValue={setFieldValue}
                error={errors.cast as string}
                // touched={touched.cast}
                placeholder="Type an actor name and press Enter"
                required
              />

              <TextArea
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter movie description"
                rows={3}
                required
                error={
                  touched.description ? (errors.description as string) : ""
                }
              />
            </div>

            <div className="space-y-4">
              
              <Input 
              label="Poster"
               type="file"
      name="poster"
      accept="image/*"
      onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) {
          console.log("File selected:", file.name, file.size, file.type);
          setFieldValue("poster", file);
        } else {
          setFieldValue("poster", null);
        }
      }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:
                    file:text-sm file:font-semibold
                    file:bg-primary/10 file:text-primary
                    hover:file:bg-primary/20"
                    error={touched.poster ? (errors.poster as string) : ''}
                />

              {/* <Input
                label="Trailer URL"
                name="trailer_url"
                value={values.trailer_url}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.trailer_url ? (errors.trailer_url as string) : ""
                }
                placeholder="https://youtube.com/watch?v=example"
              /> */}
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
