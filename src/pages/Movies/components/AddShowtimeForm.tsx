// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Formik, Form } from "formik";
// import Button from "../../../components/shared/Button";
// import Input from "../../../components/shared/Input";
// import ReusableSelect from "../../../components/shared/Select";
// import { showTimeValidationSchema } from "../../../validations";
// import { useAppDispatch, useAppSelector } from "../../../store/hook";
// import {
//   createShowtime,
//   getAllShowtimes,
//   updateShowtime,
// } from "../../../store/slices/showtime";
// import { toast } from "react-toastify";

// interface AddShowTimeProps {
//   movies: any;
//   onCancel: () => void;
//   editMode?: boolean;
//   showTimeData?: any;
// }

// const AddShowtimeForm = ({
//   movies,
//   onCancel,
//   editMode,
//   showTimeData,
// }: AddShowTimeProps) => {
//   const dispatch = useAppDispatch();
//   const { screens } = useAppSelector((state) => state.screen);
//   const { statuses } = useAppSelector((state) => state.showtimeStatus);

//   const movieOptions = movies.map((movie: any) => ({
//     value: movie.movie_id,
//     label: movie.title,
//   }));

//   const showtimeStatusOptions = [...(statuses || [])]
//     .sort((a: any, b: any) => a.name.localeCompare(b.name))
//     .map((status: { showtime_status_id: string; name: string }) => ({
//       label: status.name,
//       value: status.showtime_status_id,
//     }));

//   const screenOptions = [...(screens || [])]
//     .sort((a: any, b: any) => a.name.localeCompare(b.name))
//     .map((cinema: { cinema_id: string; name: string }) => ({
//       label: cinema.name,
//       value: cinema.cinema_id,
//     }));

//   const initialValues = {
//     movie_id: showTimeData?.movie?.name || "",
//     screen_id: showTimeData?.screen?.name || "",
//     showtime_status_id: "",
//     start_time: "",
//     // price: "",
//   };

//   async function handleSubmit(
//     values: any,
//     { resetForm }: { resetForm: () => void }
//   ) {
//     try {
//       let response;
//       const formattedValues = {
//         ...values,
//         duration: parseInt(values.duration),
//         rating: parseInt(values.rating),
//         cast: values.cast.filter((actor: any) => actor.trim() !== ""),
//       };
//       if (editMode && showTimeData?.showtime_id) {
//         delete formattedValues.movie_classification_id;
//         response = await dispatch(
//           updateShowtime({
//             id: showTimeData.showtime_id,
//             data: formattedValues,
//           })
//         ).unwrap();
//       } else {
//         const formattedValues = {
//           ...values,
//           duration: parseInt(values.duration),
//           rating: values.rating ? parseFloat(values.rating) : 0,
//           cast: values.cast.filter((actor: any) => actor.trim() !== ""),
//         };
//         response = await dispatch(createShowtime(formattedValues)).unwrap();
//       }

//       if (response.code === 200 || response.code === 201) {
//         toast.success(response.message);
//         await dispatch(getAllShowtimes());
//         resetForm();
//         onCancel();
//       }
//     } catch (error: any) {
//       console.error("Error submitting screen form", error);
//       toast.error(error?.response?.message || "Something went wrong");
//     }
//   }

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={showTimeValidationSchema}
//       onSubmit={handleSubmit}
//     >
//       {({
//         values,
//         errors,
//         touched,
//         handleChange,
//         handleBlur,
//         setFieldValue,
//         isSubmitting,
//       }) => (
//         <Form>
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <ReusableSelect
//                 label="Movie"
//                 name="movieTitle"
//                 value={values.movie_id}
//                 onChange={(value) => setFieldValue("movie_id", value)}
//                 options={movieOptions}
//                 defaultOption="Select movie"
//                 error={
//                   touched.movie_id && typeof errors.movie_id === "string"
//                     ? errors.movie_id
//                     : undefined
//                 }
//                 required
//               />
//               <ReusableSelect
//                 label="Screen"
//                 name="screen"
//                 value={values.screen_id}
//                 onChange={(value) => setFieldValue("screen_id", value)}
//                 options={screenOptions}
//                 defaultOption="Select screen"
//                 error={
//                   touched.screen_id && typeof errors.screen_id === "string"
//                     ? errors.screen_id
//                     : ""
//                 }
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <ReusableSelect
//                 label="Showtime Status"
//                 name="showtime_status_id"
//                 value={values.showtime_status_id}
//                 onChange={(value) => setFieldValue("showtime_status_id", value)}
//                 options={showtimeStatusOptions}
//                 onBlur={handleBlur}
//                 error={
//                   touched.showtime_status_id &&
//                   errors.showtime_status_id === "string"
//                     ? errors.showtime_status_id
//                     : undefined
//                 }
//                 required
//               />

//               <Input
//                 label="Time"
//                 name="time"
//                 type="time"
//                 value={values.start_time}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={
//                   touched.start_time && typeof errors.start_time === "string"
//                     ? errors.start_time
//                     : undefined
//                 }
//                 required
//               />
//             </div>

//             {/* <Input
//               label="Ticket Price ($)"
//               name="price"
//               type="number"
//               step="0.01"
//               min="0"
//               value={values.price}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               error={touched.price && errors.price ? errors.price : ""}
//               placeholder="12.99"
//               required
//             /> */}
//           </div>

//           <div className="flex gap-2 pt-6 border-t mt-6">
//             <Button
//               type="submit"
//               title={isSubmitting ? "Creating Showtime..." : "Create Showtime"}
//               className="flex-1 rounded-md"
//               disabled={isSubmitting}
//             />
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onCancel}
//               disabled={isSubmitting}
//               title="Cancel"
//               className="rounded-md"
//             />
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default AddShowtimeForm;

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
  const { screens } = useAppSelector((state) => state.screen);
  const { statuses } = useAppSelector((state) => state.showtimeStatus);

  const movieOptions = movies.map((movie: any) => ({
    value: movie.movie_id,
    label: movie.title,
  }));

  const showtimeStatusOptions = [...(statuses || [])]
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
    .map((status: { showtime_status_id: string; name: string }) => ({
      label: status.name,
      value: status.showtime_status_id,
    }));

  const screenOptions = [...(screens || [])]
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
    .map(
      (cinema: {
        screen_id: string;
        name: string;
        cinema: { name: string };
      }) => ({
        label: `${cinema.name} (${cinema?.cinema.name})`,
        value: cinema.screen_id,
      })
    );

  // Pre-fill date and time from start_time (if editing)
  const initialValues = {
    movie_id: showTimeData?.movie?.movie_id || "",
    screen_id: showTimeData?.screen?.screen_id || "",
    showtime_status_id: showTimeData?.showtime_status_id || "",
    show_date: showTimeData?.start_time
      ? showTimeData.start_time.split(" ")[0]
      : "",
    show_time: showTimeData?.start_time
      ? showTimeData.start_time.split(" ")[1]?.slice(0, 5)
      : "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      // Omit the temporary fields
      const { show_date, show_time, ...rest } = values;

      // Combine date and time into backend format
      const start_time = `${values.show_date} ${values.show_time}:00`;

      const formattedValues = {
        ...rest,
        start_time,
      };
      console.log("values to send", formattedValues);
      let response;
      if (editMode && showTimeData?.showtime_id) {
        response = await dispatch(
          updateShowtime({
            id: showTimeData.showtime_id,
            data: formattedValues,
          })
        ).unwrap();
      } else {
        response = await dispatch(createShowtime(formattedValues)).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllShowtimes());
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      console.error("Error submitting showtime form", error);
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={showTimeValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
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
            {/* Movie and Screen */}
            <div className="grid grid-cols-2 gap-4">
              <ReusableSelect
                label="Movie"
                name="movie_id"
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
              <ReusableSelect
                label="Screen"
                name="screen_id"
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

            {/* status */}
            <ReusableSelect
              label="Showtime Status"
              name="showtime_status_id"
              value={values.showtime_status_id}
              onChange={(value) => setFieldValue("showtime_status_id", value)}
              options={showtimeStatusOptions}
              onBlur={handleBlur}
              error={
                touched.showtime_status_id &&
                typeof errors.showtime_status_id === "string"
                  ? errors.showtime_status_id
                  : undefined
              }
              required
            />

            {/* Date + Time */}
            <div className="flex gap-4">
              <Input
                label="Date"
                name="show_date"
                type="date"
                value={values.show_date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.show_date && typeof errors.show_date === "string"
                    ? errors.show_date
                    : undefined
                }
                required
                className="flex-1 w-full"
              />

              <Input
                label="Time"
                name="show_time"
                type="time"
                value={values.show_time}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.show_time && typeof errors.show_time === "string"
                    ? errors.show_time
                    : undefined
                }
                required
                className="flex-1 w-full"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              title={
                isSubmitting
                  ? editMode
                    ? "Updating Showtime..."
                    : "Creating Showtime..."
                  : editMode
                  ? "Update Showtime"
                  : "Create Showtime"
              }
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
