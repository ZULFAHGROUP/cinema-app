/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import { ImageIcon } from "lucide-react";
import ReusableSelect from "../../../components/shared/Select";
import { addMovieValidationSchema } from "../../../validations";

interface AddMovieProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const AddMovieForm = ({ onSubmit, onCancel }: AddMovieProps) => {
  const ratingOptions = [
    { value: "G", label: "G - General Audiences" },
    { value: "PG", label: "PG - Parental Guidance" },
    { value: "PG-13", label: "PG-13 - Parents Strongly Cautioned" },
    { value: "R", label: "R - Restricted" },
    { value: "NC-17", label: "NC-17 - Adults Only" },
  ];

  const statusOptions = [
    { value: "Now Playing", label: "Now Playing" },
    { value: "Coming Soon", label: "Coming Soon" },
    { value: "Off Screen", label: "Off Screen" },
  ];

  const initialValues = {
    title: "",
    genre: "",
    duration: "",
    rating: "",
    releaseDate: "",
    description: "",
    status: "Now Playing",
    imdbRating: "",
    poster: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addMovieValidationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
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
                label="Genre"
                name="genre"
                value={values.genre}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.genre && errors.genre ? errors.genre : ""}
                placeholder="e.g., Action/Adventure"
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
                  error={
                    touched.duration && errors.duration ? errors.duration : ""
                  }
                  placeholder="120"
                  required
                />

                <ReusableSelect
                  label="Rating"
                  name="rating"
                  value={values.rating}
                  onChange={(value) => setFieldValue("rating", value)}
                  options={ratingOptions}
                  defaultOption="Select rating"
                  error={touched.rating && errors.rating ? errors.rating : ""}
                  required
                />
              </div>

              <Input
                label="Release Date"
                name="releaseDate"
                type="date"
                value={values.releaseDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.releaseDate && errors.releaseDate
                    ? errors.releaseDate
                    : ""
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="IMDB Rating"
                  name="imdbRating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={values.imdbRating}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.imdbRating && errors.imdbRating
                      ? errors.imdbRating
                      : ""
                  }
                  placeholder="8.5"
                />

                <ReusableSelect
                  label="Status"
                  name="status"
                  value={values.status}
                  onChange={(value) => setFieldValue("status", value)}
                  options={statusOptions}
                  defaultOption="Select status"
                  error={touched.status && errors.status ? errors.status : ""}
                  required
                />
              </div>

              <div>
                <label className="block font-medium md:text-lg mb-2">
                  Description
                </label>
                <textarea
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
                />
                {touched.description && errors.description && (
                  <p className="text-sm text-red-500 italic mt-1">
                    {errors.description}
                  </p>
                )}
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
                  <Button variant="outline" size="sm" type="button">
                    Browse Files
                  </Button>
                </div>
              </div>

              <Input
                label="Poster URL (Optional)"
                name="poster"
                value={values.poster}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://example.com/poster.jpg"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={isSubmitting ? "Adding Movie..." : "Add Movie"}
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
