/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../../components/shared/Button";
import Input from "../../../components/shared/Input";
import ReusableSelect from "../../../components/shared/Select";

const validationSchema = Yup.object({
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

interface AddShowTimeProps {
  movies: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const AddShowtimeForm = ({ movies, onSubmit, onCancel }: AddShowTimeProps) => {
  const movieOptions = movies.map((movie: any) => ({
    value: movie.title,
    label: movie.title,
  }));

  const theaterOptions = [
    { value: "Theater 1", label: "Theater 1" },
    { value: "Theater 2", label: "Theater 2" },
    { value: "Theater 3", label: "Theater 3" },
  ];

  const screenOptions = [
    { value: "Screen A", label: "Screen A" },
    { value: "Screen B", label: "Screen B" },
    { value: "Screen C", label: "Screen C" },
  ];

  const initialValues = {
    movieTitle: "",
    theater: "",
    screen: "",
    date: "",
    time: "",
    price: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
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
      }) => (
        <Form>
          <div className="space-y-4">
            <ReusableSelect
              label="Movie"
              name="movieTitle"
              value={values.movieTitle}
              onChange={(value) => setFieldValue("movieTitle", value)}
              options={movieOptions}
              defaultOption="Select movie"
              error={
                touched.movieTitle && errors.movieTitle ? errors.movieTitle : ""
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <ReusableSelect
                label="Theater"
                name="theater"
                value={values.theater}
                onChange={(value) => setFieldValue("theater", value)}
                options={theaterOptions}
                defaultOption="Select theater"
                error={touched.theater && errors.theater ? errors.theater : ""}
                required
              />

              <ReusableSelect
                label="Screen"
                name="screen"
                value={values.screen}
                onChange={(value) => setFieldValue("screen", value)}
                options={screenOptions}
                defaultOption="Select screen"
                error={touched.screen && errors.screen ? errors.screen : ""}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                name="date"
                type="date"
                value={values.date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.date && errors.date ? errors.date : ""}
                restrictPastDate={true}
                required
              />

              <Input
                label="Time"
                name="time"
                type="time"
                value={values.time}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.time && errors.time ? errors.time : ""}
                required
              />
            </div>

            <Input
              label="Ticket Price ($)"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.price && errors.price ? errors.price : ""}
              placeholder="12.99"
              required
            />
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              title={isSubmitting ? "Creating Showtime..." : "Create Showtime"}
              className="flex-1 rounded-md"
              disabled={isSubmitting}
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

export default AddShowtimeForm;
