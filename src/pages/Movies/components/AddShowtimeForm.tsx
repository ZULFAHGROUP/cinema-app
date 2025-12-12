/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form, FieldArray } from "formik";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import Input from "../../../components/shared/Input";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { createShowtime, updateShowtime, getAllShowtimes } from "../../../store/slices/showtime";
import { toast } from "react-toastify";
import { getAllScreen } from "../../../store/slices/screen";
import { useEffect } from "react";
import { getAllShowtimeStatuses } from "../../../store/slices/showtimeStatus";
import { generateHalfHourSlots, getDisabledTimeSlots, isTimeSlotAvailable, minutesToTime, timeToMinutes } from "../../../utils/showtimeform";

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
  const { screensPage, screensLimit, screensByCinema } = useAppSelector(
    (state) => state.screen
  );
  const { statuses, page, limit } = useAppSelector(
    (state) => state.showtimeStatus
  );

  useEffect(() => {
    dispatch(getAllShowtimeStatuses({ page, limit }));
  }, [dispatch, page, limit]);

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
    screen_id: "",
    showtime_status_id: "",
    schedules: [],
  };

  const { user } = useAppSelector((state) => state.accounts.data);
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin";

  async function handleSubmit(values: any, { resetForm }: any) {
    try {
      const response = await dispatch(
        editMode
          ? updateShowtime({ id: showTimeData.showtime_id, data: values })
          : createShowtime(values)
      ).unwrap();

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        
        // Refresh showtime list - only pass cinema_id for admin users
        const cinemaIdToUse = isAdmin ? values.cinema_id : undefined;
        await dispatch(
          getAllShowtimes({
            page: 1,
            limit: 10,
            cinema_id: cinemaIdToUse
          })
        );
        
        resetForm();
        onCancel();
      }
    } catch (err: any) {
      toast.error(err?.response?.message || "Something went wrong");
    }
  }

  const getCinemaScreens = (cinemaId: string) => {
    return screensByCinema[cinemaId] || [];
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        setFieldValue,
        isSubmitting,
        handleChange,
        handleBlur,
        touched,
        errors,
      }) => {
        const selectedMovie = movieOptions.find(
          (m) => m.value === values.movie_id
        );
        const duration = selectedMovie?.duration || 0;

        const allSlots = generateHalfHourSlots();
        const cinemaScreens = getCinemaScreens(values?.cinema_id);
        console.log("cinema screens are", cinemaScreens);
        return (
          <Form className="space-y-6 h-full">
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
                onChange={(cinemaId: string | number) => {
                  setFieldValue("cinema_id", cinemaId);

                  dispatch(
                    getAllScreen({
                      screensPage,
                      screensLimit,
                      cinema_id: cinemaId,
                    })
                  );
                }}
                // onChange={(val) => setFieldValue("cinema_id", val)}
                options={cinemaOptions}
                defaultOption="Select screen"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ReusableSelect
                label="Screen"
                name="screen_id"
                value={values.screen_id}
                onChange={(val) => setFieldValue("screen_id", val)}
                options={
                  cinemaScreens?.map((screen: any) => ({
                    label: screen.name,
                    value: screen.screen_id,
                  })) || []
                }
                defaultOption="Select screen"
                required
              />
              <ReusableSelect
                label="Showtime Status"
                name="showtime_status_id"
                value={values.showtime_status_id}
                onChange={(val) => setFieldValue("showtime_status_id", val)}
                options={
                  statuses?.map((screen: any) => ({
                    label: screen.name,
                    value: screen.showtime_status_id,
                  })) || []
                }
                defaultOption="Select showtime status"
                required
              />
            </div>

            {/* Movie Duration Display */}
            {duration > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm font-serif text-blue-800">
                  <span className="font-semibold">Movie Duration:</span>{" "}
                  {duration} minutes
                  {duration >= 60 &&
                    ` (${Math.floor(duration / 60)}h ${duration % 60}m)`}
                </p>
              </div>
            )}

            {/* SHOWTIMES */}
            <FieldArray name="schedules">
              {({ push, remove }) => (
                <div className="h-60 overflow-y-scroll space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium font-sans">Schedules</p>
                    <Button
                      type="button"
                      title="Add Date"
                      variant="secondary"
                      onClick={() => push({ date: "", times: [] })}
                      className="rounded-md"
                    />
                  </div>

                  {values.schedules.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground font-serif">
                      No showtimes added yet. Click "Add Date" to get started.
                    </div>
                  )}

                  {values.schedules.map((item: any, index: number) => {
                    const disabledTimes = duration
                      ? getDisabledTimeSlots(item.times || [], duration)
                      : [];

                    return (
                      <div
                        key={index}
                        className="border p-4 rounded-md space-y-4 bg-gray-50"
                      >
                        {/* Date */}
                        <Input
                          label="Date"
                          name={`schedules[${index}].date`}
                          type="date"
                          value={item.date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.schedules?.[index] &&
                            errors.schedules?.[index] &&
                            typeof errors.schedules[index] === "object" &&
                            "date" in errors.schedules[index]
                              ? (errors.schedules[index] as any).date
                              : undefined
                          }
                          required
                          className="w-full"
                        />

                        {/* TIMES */}
                        <div>
                          <ReusableSelect
                            mode="multiple"
                            label="Times"
                            name={`schedules[${index}].times`}
                            options={allSlots.map((t) => {
                              const isSelected = (item.times || []).includes(t);
                              const isDisabled =
                                disabledTimes.includes(t) && !isSelected;

                              return {
                                label: isDisabled
                                  ? `${t} (Unavailable - Overlaps with selected time)`
                                  : t,
                                value: t,
                                disabled: isDisabled,
                              };
                            })}
                            value={item.times || []}
                            onChange={(vals: any) => {
                              const currentTimes = item.times || [];

                              // Determine if this is an addition or removal
                              if (vals.length > currentTimes.length) {
                                // Adding a new time - check if it's valid
                                const newTime = vals.find(
                                  (t: string) => !currentTimes.includes(t)
                                );

                                if (newTime) {
                                  // Check if the new time would overlap with existing times
                                  const wouldOverlap = !isTimeSlotAvailable(
                                    newTime,
                                    currentTimes,
                                    duration
                                  );

                                  if (wouldOverlap) {
                                    // Don't add the time, keep current selection
                                    return;
                                  }
                                }

                                // New time is valid, update
                                setFieldValue(
                                  `schedules[${index}].times`,
                                  vals
                                );
                              } else {
                                // Removing a time - always allow
                                setFieldValue(
                                  `schedules[${index}].times`,
                                  vals
                                );
                              }
                            }}
                            defaultOption="Select times"
                            required
                          />
                          {item.times?.length > 0 && duration > 0 && (
                            <div className="mt-2 p-2 bg-white rounded border text-xs font-serif">
                              <p className="font-semibold mb-1">
                                Selected Showtimes:
                              </p>
                              {item.times.map((time: string) => {
                                const startMinutes = timeToMinutes(time);
                                const endMinutes = startMinutes + duration;
                                const endTime = minutesToTime(endMinutes);
                                return (
                                  <div
                                    key={time}
                                    className="text-muted-foreground"
                                  >
                                    • {time} - {endTime} ({duration} mins)
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Remove */}
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            type="button"
                            title="Remove Date"
                            onClick={() => remove(index)}
                            className="rounded-md"
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
                className="flex-1 rounded-md"
                disabled={isSubmitting}
              />

              <Button
                type="button"
                title="Cancel"
                variant="outline"
                onClick={onCancel}
                className="rounded-md"
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
