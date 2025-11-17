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
// import { getAllMovies } from "../../../store/slices/movie";

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
//     .map(
//       (cinema: {
//         screen_id: string;
//         name: string;
//         cinema: { name: string };
//       }) => ({
//         label: `${cinema.name} (${cinema?.cinema.name})`,
//         value: cinema.screen_id,
//       })
//     );

//   // Pre-fill date and time from start_time (if editing)
//   const initialValues = {
//     movie_id: showTimeData?.movie?.movie_id || "",
//     screen_id: showTimeData?.screen?.screen_id || "",
//     showtime_status_id: showTimeData?.showtime_status_id || "",
//     show_date: showTimeData?.start_time
//       ? showTimeData.start_time.split(" ")[0]
//       : "",
//     show_time: showTimeData?.start_time
//       ? showTimeData.start_time.split(" ")[1]?.slice(0, 5)
//       : "",
//   };

//   async function handleSubmit(
//     values: any,
//     { resetForm }: { resetForm: () => void }
//   ) {
//     try {
//       // Omit the temporary fields
//       const { show_date, show_time, ...rest } = values;

//       // Combine date and time into backend format
//       const start_time = `${values.show_date} ${values.show_time}:00`;

//       const formattedValues = {
//         ...rest,
//         start_time,
//       };
//       console.log("values to send", formattedValues);
//       let response;
//       if (editMode && showTimeData?.showtime_id) {
//         response = await dispatch(
//           updateShowtime({
//             id: showTimeData.showtime_id,
//             data: formattedValues,
//           })
//         ).unwrap();
//       } else {
//         response = await dispatch(createShowtime(formattedValues)).unwrap();
//       }

//       if (response.code === 200 || response.code === 201) {
//         toast.success(response.message);
//         await dispatch(getAllShowtimes());
//         await dispatch(getAllMovies());
//         resetForm();
//         onCancel();
//       }
//     } catch (error: any) {
//       console.error("Error submitting showtime form", error);
//       toast.error(error?.response?.message || "Something went wrong");
//     }
//   }

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={showTimeValidationSchema}
//       onSubmit={handleSubmit}
//       enableReinitialize
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
//             {/* Movie and Screen */}
//             <div className="grid grid-cols-2 gap-4">
//               <ReusableSelect
//                 label="Movie"
//                 name="movie_id"
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
//                 name="screen_id"
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

//             {/* status */}
//             <ReusableSelect
//               label="Showtime Status"
//               name="showtime_status_id"
//               value={values.showtime_status_id}
//               onChange={(value) => setFieldValue("showtime_status_id", value)}
//               options={showtimeStatusOptions}
//               onBlur={handleBlur}
//               error={
//                 touched.showtime_status_id &&
//                 typeof errors.showtime_status_id === "string"
//                   ? errors.showtime_status_id
//                   : undefined
//               }
//               required
//             />

//             {/* Date + Time */}
//             <div className="flex gap-4">
//               <Input
//                 label="Date"
//                 name="show_date"
//                 type="date"
//                 value={values.show_date}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={
//                   touched.show_date && typeof errors.show_date === "string"
//                     ? errors.show_date
//                     : undefined
//                 }
//                 required
//                 className="flex-1 w-full"
//               />

//               <Input
//                 label="Time"
//                 name="show_time"
//                 type="time"
//                 value={values.show_time}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={
//                   touched.show_time && typeof errors.show_time === "string"
//                     ? errors.show_time
//                     : undefined
//                 }
//                 required
//                 className="flex-1 w-full"
//               />
//             </div>
//           </div>

//           {/* Footer Buttons */}
//           <div className="flex gap-2 pt-6 border-t mt-6">
//             <Button
//               type="submit"
//               title={
//                 isSubmitting
//                   ? editMode
//                     ? "Updating Showtime..."
//                     : "Creating Showtime..."
//                   : editMode
//                   ? "Update Showtime"
//                   : "Create Showtime"
//               }
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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Formik, Form, FieldArray } from "formik";
// import Button from "../../../components/shared/Button";
// import ReusableSelect from "../../../components/shared/Select";
// import { useAppDispatch, useAppSelector } from "../../../store/hook";
// import { createShowtime, updateShowtime } from "../../../store/slices/showtime";
// import { toast } from "react-toastify";

// const DAYS = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];

// function generateTimeSlots(interval: number) {
//   const times: string[] = [];
//   let hr = 0;
//   let min = 0;

//   while (hr < 24) {
//     const h = hr.toString().padStart(2, "0");
//     const m = min.toString().padStart(2, "0");
//     times.push(`${h}:${m}`);

//     min += interval;
//     if (min >= 60) {
//       hr += Math.floor(min / 60);
//       min = min % 60;
//     }
//   }
//   return times;
// }

// interface AddShowTimeProps {
//   movies: any[];
//   cinemas: any[];
//   onCancel: () => void;
//   editMode?: boolean;
//   showTimeData?: any;
// }

// export default function AddShowtimeForm({
//   movies,
//   cinemas,
//   onCancel,
//   editMode,
//   showTimeData,
// }: AddShowTimeProps) {
//   const dispatch = useAppDispatch();

//   const movieOptions = movies?.map((m) => ({
//     label: m.title,
//     value: m.movie_id,
//     duration: m.duration,
//   }));

//   const cinemaOptions = cinemas?.map((c) => ({
//     label: c.name,
//     value: c.cinema_id,
//   }));

//   const initialValues = {
//     movie_id: "",
//     cinema_id: "",
//     showtimes: [],
//   };

//   async function handleSubmit(values: any, { resetForm }: any) {
//     try {
//       const response = await dispatch(
//         editMode
//           ? updateShowtime({ id: showTimeData.showtime_id, data: values })
//           : createShowtime(values)
//       ).unwrap();

//       if (response.code === 200 || response.code === 201) {
//         toast.success(response.message);
//         resetForm();
//         onCancel();
//       }
//     } catch (err: any) {
//       toast.error(err?.response?.message || "Something went wrong");
//     }
//   }

//   return (
//     <Formik
//       initialValues={initialValues}
//       onSubmit={handleSubmit}
//       enableReinitialize
//     >
//       {({ values, setFieldValue, isSubmitting }) => {
//         const selectedMovie = movieOptions.find(
//           (m) => m.value === values.movie_id
//         );
//         const movieInterval = selectedMovie?.duration || 0;

//         const availableTimeSlots = movieInterval
//           ? generateTimeSlots(movieInterval)
//           : [];

//         return (
//           <Form className="space-y-6">
//             {/* Movie & Cinema */}
//             <div className="grid grid-cols-2 gap-4">
//               <ReusableSelect
//                 label="Movie"
//                 name="movie_id"
//                 value={values.movie_id}
//                 onChange={(val) => setFieldValue("movie_id", val)}
//                 options={movieOptions}
//                 defaultOption="Select movie"
//                 required
//               />

//               <ReusableSelect
//                 label="Cinema"
//                 name="cinema_id"
//                 value={values.cinema_id}
//                 onChange={(val) => setFieldValue("cinema_id", val)}
//                 options={cinemaOptions}
//                 defaultOption="Select cinema"
//                 required
//               />
//             </div>

//             {/* SHOWTIMES (DAYS + MULTIPLE TIMES) */}
//             <FieldArray name="showtimes">
//               {({ push, remove }) => (
//                 <div className="space-y-4">
//                   <div className="flex justify-between">
//                     <p className="font-medium">Showtimes (Mon–Sun)</p>
//                     <Button
//                       type="button"
//                       title="Add Day"
//                       variant="secondary"
//                       onClick={() =>
//                         push({
//                           day: "",
//                           times: [],
//                         })
//                       }
//                     />
//                   </div>

//                   {values.showtimes.map((item: any, index: number) => (
//                     <div
//                       key={index}
//                       className="border p-4 rounded-md space-y-4 bg-gray-50"
//                     >
//                       {/* Day */}
//                       <ReusableSelect
//                         label="Day"
//                         name={`showtimes[${index}].day`}
//                         value={item.day}
//                         options={DAYS.map((d) => ({ label: d, value: d }))}
//                         onChange={(val) =>
//                           setFieldValue(`showtimes[${index}].day`, val)
//                         }
//                         defaultOption="Select day"
//                         required
//                       />

//                       {/* MULTI-TIME PICKER */}
//                       <ReusableSelect
//                         mode="multiple"
//                         label="Times"
//                         name={`showtimes[${index}].times`}
//                         options={availableTimeSlots.map((t) => ({
//                           label: t,
//                           value: t,
//                         }))}
//                         value={item.times}
//                         onChange={(vals) =>
//                           setFieldValue(`showtimes[${index}].times`, vals)
//                         }
//                         defaultOption="Select times"
//                         required
//                       />

//                       <div className="flex justify-end">
//                         <Button
//                           variant="outline"
//                           type="button"
//                           title="Remove"
//                           onClick={() => remove(index)}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </FieldArray>

//             {/* FOOTER BUTTONS */}
//             <div className="flex gap-2 pt-6 border-t">
//               <Button
//                 type="submit"
//                 title={
//                   isSubmitting
//                     ? editMode
//                       ? "Updating..."
//                       : "Creating..."
//                     : editMode
//                     ? "Update Showtime"
//                     : "Create Showtime"
//                 }
//                 className="flex-1"
//                 disabled={isSubmitting}
//               />
//               <Button
//                 type="button"
//                 title="Cancel"
//                 variant="outline"
//                 onClick={onCancel}
//               />
//             </div>
//           </Form>
//         );
//       }}
//     </Formik>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form, FieldArray } from "formik";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import { useAppDispatch } from "../../../store/hook";
import { createShowtime, updateShowtime } from "../../../store/slices/showtime";
import { toast } from "react-toastify";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Generate slots every 30 minutes
function generateHalfHourSlots() {
  const result: string[] = [];
  for (let h = 0; h < 24; h++) {
    result.push(`${String(h).padStart(2, "0")}:00`);
    result.push(`${String(h).padStart(2, "0")}:30`);
  }
  return result;
}

// Convert overlapping windows into disabled slots
function getDisabledTimeSlots(selectedTimes: string[], duration: number) {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const disabled = new Set<string>();

  selectedTimes.forEach((startTime) => {
    const start = toMinutes(startTime);
    const end = start + duration;

    for (let i = start; i < end; i += 30) {
      const h = String(Math.floor(i / 60)).padStart(2, "0");
      const m = String(i % 60).padStart(2, "0");
      disabled.add(`${h}:${m}`);
    }
  });

  return Array.from(disabled);
}

interface AddShowTimeProps {
  movies: any[];
  cinemas: any[];
  onCancel: () => void;
  editMode?: boolean;
  showTimeData?: any;
}

export default function AddShowtimeForm({
  movies,
  cinemas,
  onCancel,
  editMode,
  showTimeData,
}: AddShowTimeProps) {
  const dispatch = useAppDispatch();

  const movieOptions = movies?.map((m) => ({
    label: m.title,
    value: m.movie_id,
    duration: m.duration,
  }));

  const cinemaOptions = cinemas?.map((c) => ({
    label: c.name,
    value: c.cinema_id,
  }));

  const initialValues = {
    movie_id: "",
    cinema_id: "",
    showtimes: [],
  };

  async function handleSubmit(values: any, { resetForm }: any) {
    try {
      const response = await dispatch(
        editMode
          ? updateShowtime({ id: showTimeData.showtime_id, data: values })
          : createShowtime(values)
      ).unwrap();

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        resetForm();
        onCancel();
      }
    } catch (err: any) {
      toast.error(err?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting }) => {
        const selectedMovie = movieOptions.find(
          (m) => m.value === values.movie_id
        );
        const duration = selectedMovie?.duration || 0;

        const allSlots = generateHalfHourSlots();

        return (
          <Form className="space-y-6">
            {/* Movie & Cinema */}
            <div className="grid grid-cols-2 gap-4">
              <ReusableSelect
                label="Movie"
                name="movie_id"
                value={values.movie_id}
                onChange={(val) => setFieldValue("movie_id", val)}
                options={movieOptions}
                defaultOption="Select movie"
                required
              />

              <ReusableSelect
                label="Cinema"
                name="cinema_id"
                value={values.cinema_id}
                onChange={(val) => setFieldValue("cinema_id", val)}
                options={cinemaOptions}
                defaultOption="Select cinema"
                required
              />
            </div>

            {/* SHOWTIMES */}
            <FieldArray name="showtimes">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="font-medium">Showtimes (Mon–Sun)</p>
                    <Button
                      type="button"
                      title="Add Day"
                      variant="secondary"
                      onClick={() => push({ day: "", times: [] })}
                    />
                  </div>

                  {values.showtimes.map((item: any, index: number) => {
                    const disabledTimes = duration
                      ? getDisabledTimeSlots(item.times, duration)
                      : [];

                    return (
                      <div
                        key={index}
                        className="border p-4 rounded-md space-y-4 bg-gray-50"
                      >
                        {/* Day */}
                        <ReusableSelect
                          label="Day"
                          name={`showtimes[${index}].day`}
                          value={item.day}
                          options={DAYS.map((d) => ({ label: d, value: d }))}
                          onChange={(val) =>
                            setFieldValue(`showtimes[${index}].day`, val)
                          }
                          defaultOption="Select day"
                          required
                        />

                        {/* TIMES */}
                        <ReusableSelect
                          mode="multiple"
                          label="Times"
                          name={`showtimes[${index}].times`}
                          options={allSlots.map((t) => ({
                            label: disabledTimes.includes(t)
                              ? `${t} (Unavailable)`
                              : t,
                            value: t,
                            disabled: disabledTimes.includes(t),
                          }))}
                          value={item.times}
                          onChange={(vals) =>
                            setFieldValue(`showtimes[${index}].times`, vals)
                          }
                          defaultOption="Select times"
                          required
                        />

                        {/* Remove */}
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            type="button"
                            title="Remove"
                            onClick={() => remove(index)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </FieldArray>

            {/* FOOTER */}
            <div className="flex gap-2 pt-6 border-t">
              <Button
                type="submit"
                title={
                  isSubmitting
                    ? editMode
                      ? "Updating..."
                      : "Creating..."
                    : editMode
                    ? "Update Showtime"
                    : "Create Showtime"
                }
                className="flex-1"
                disabled={isSubmitting}
              />

              <Button
                type="button"
                title="Cancel"
                variant="outline"
                onClick={onCancel}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
