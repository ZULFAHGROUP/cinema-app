/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Button from "../../../components/shared/Button";
import Input from "../../../components/shared/Input";
import ReusableSelect from "../../../components/shared/Select";
import { showTimeValidationSchema } from "../../../validations";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  createShowtime,
  getAllShowtimes,
  updateShowtime,
} from "../../../store/slices/showtime";
import { toast } from "react-toastify";

interface AddShowTimeProps {
  movies: any;
  onCancel: () => void;
  editMode?: boolean;
  showTimeData?: any;
}

const AddShowtimeForm = ({
  movies,
  onCancel,
  editMode,
  showTimeData,
}: AddShowTimeProps) => {
  const dispatch = useAppDispatch();
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const { screens } = useAppSelector((state) => state.screen);

  const movieOptions = movies.map((movie: any) => ({
    value: movie.movie_id,
    label: movie.title,
  }));

  const cinemaOptions = [...(allCinemas || [])]
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
    .map((cinema: { cinema_id: string; name: string }) => ({
      label: cinema.name,
      value: cinema.cinema_id,
    }));

  const screenOptions = [...(screens || [])]
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
    .map((cinema: { cinema_id: string; name: string }) => ({
      label: cinema.name,
      value: cinema.cinema_id,
    }));

  const initialValues = {
    movie_id: showTimeData?.movie?.name || "",
    theater: "",
    screen_id: showTimeData?.screen?.name || "",
    date: "",
    start_time: "",
    price: "",
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
      if (editMode && showTimeData?.showtime_id) {
        delete formattedValues.movie_classification_id;
        response = await dispatch(
          updateShowtime({
            id: showTimeData.showtime_id,
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
        response = await dispatch(createShowtime(formattedValues)).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllShowtimes());
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
      validationSchema={showTimeValidationSchema}
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
      }) => (
        <Form>
          <div className="space-y-4">
            <ReusableSelect
              label="Movie"
              name="movieTitle"
              value={values.movie_id}
              onChange={(value) => setFieldValue("movie_id", value)}
              options={movieOptions}
              defaultOption="Select movie"
              error={
                touched.movie_id && typeof errors.movie_id === "string"
                  ? errors.movie_id
                  : undefined
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <ReusableSelect
                label="Theater"
                name="theater"
                value={values.theater}
                onChange={(value) => setFieldValue("theater", value)}
                options={cinemaOptions}
                defaultOption="Select theater"
                error={touched.theater && errors.theater ? errors.theater : ""}
                required
              />

              <ReusableSelect
                label="Screen"
                name="screen"
                value={values.screen_id}
                onChange={(value) => setFieldValue("screen_id", value)}
                options={screenOptions}
                defaultOption="Select screen"
                error={
                  touched.screen_id && typeof errors.screen_id === "string"
                    ? errors.screen_id
                    : ""
                }
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
                value={values.start_time}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.start_time && typeof errors.start_time === "string"
                    ? errors.start_time
                    : undefined
                }
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
