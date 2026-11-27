/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form, FieldArray } from "formik";
import { Calendar, Clock, Plus, Trash2, Film } from "lucide-react";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import Input from "../../../components/shared/Input";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  createShowtime,
  updateShowtime,
  getAllShowtimes,
} from "../../../store/slices/showtime";
import { toast } from "react-toastify";
import { getAllScreen } from "../../../store/slices/screen";
import { useEffect } from "react";
import { getAllShowtimeStatuses } from "../../../store/slices/showtimeStatus";
import {
  generateHalfHourSlots,
  getDisabledTimeSlots,
  isTimeSlotAvailable,
  minutesToTime,
  timeToMinutes,
  getNowMinutes,
  isToday,
} from "../../../utils/showtimeform.utils";

interface AddShowTimeProps {
  movies: any[];
  cinemas: any[];
  onCancel: () => void;
  editMode?: boolean;
  showTimeData?: any;
  preSelectedMovieId?: string;
}

export default function AddShowtimeForm({
  movies,
  cinemas,
  onCancel,
  editMode,
  showTimeData,
  preSelectedMovieId,
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

  useEffect(() => {
    if (editMode && showTimeData?.screen?.cinema_id) {
      dispatch(
        getAllScreen({
          screensPage,
          screensLimit,
          cinema_id: showTimeData.screen.cinema_id,
        })
      );
    }
  }, [editMode, showTimeData, dispatch, screensPage, screensLimit]);

  const movieOptions =
    movies?.map((m) => ({
      label: m.title,
      value: m.movie_id,
      duration: m.duration,
    })) || [];

  const cinemaOptions =
    cinemas?.map((c) => ({
      label: c.name,
      value: c.cinema_id,
    })) || [];

  const initialValues = {
    movie_id: editMode ? showTimeData?.movie_id : preSelectedMovieId || "",
    cinema_id: editMode ? showTimeData?.screen?.cinema_id : "",
    screen_id: editMode ? showTimeData?.screen_id : "",
    showtime_status_id: editMode ? showTimeData?.showtime_status_id : "",
    schedules: editMode
      ? [
          {
            date: showTimeData?.show_date
              ? new Date(showTimeData.show_date).toISOString().split("T")[0]
              : "",
            times: [showTimeData?.show_time?.substring(0, 5)],
          },
        ]
      : [{ date: "", times: [] }],
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
        await dispatch(
          getAllShowtimes({
            page: 1,
            limit: 10,
          })
        );
        resetForm();
        onCancel();
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
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

        return (
          <Form className="space-y-5">
            {/* Section 1: Movie, Cinema, Screen & Status */}
            <div className="rounded-2xl bg-stone-50/80 border border-stone-200/80 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Film size={16} className="text-[#c77e3b]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    1. Movie & Auditorium Selection
                  </span>
                </div>
                {duration > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fff8ea] border border-[#c77e3b]/30 text-xs font-semibold text-[#754f2c]">
                    <Clock size={12} />
                    {duration} mins
                    {duration >= 60 &&
                      ` (${Math.floor(duration / 60)}h ${duration % 60}m)`}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <ReusableSelect
                  label="Movie"
                  name="movie_id"
                  value={values.movie_id}
                  onChange={(val) => setFieldValue("movie_id", val)}
                  options={movieOptions}
                  defaultOption="Select movie"
                  required
                  disabled={!!preSelectedMovieId || editMode}
                />

                <ReusableSelect
                  label="Cinema Branch"
                  name="cinema_id"
                  value={values.cinema_id}
                  onChange={(cinemaId: string | number) => {
                    setFieldValue("cinema_id", cinemaId);
                    setFieldValue("screen_id", "");
                    dispatch(
                      getAllScreen({
                        screensPage,
                        screensLimit,
                        cinema_id: cinemaId,
                      })
                    );
                  }}
                  options={cinemaOptions}
                  defaultOption="Select cinema branch"
                  required
                />

                <ReusableSelect
                  label="Auditorium Screen"
                  name="screen_id"
                  value={values.screen_id}
                  onChange={(val) => setFieldValue("screen_id", val)}
                  options={
                    cinemaScreens?.map((screen: any) => ({
                      label: screen.name,
                      value: screen.screen_id,
                    })) || []
                  }
                  defaultOption={
                    values.cinema_id
                      ? "Select screen"
                      : "Choose a cinema first"
                  }
                  disabled={!values.cinema_id}
                  required
                />

                <ReusableSelect
                  label="Showtime Status"
                  name="showtime_status_id"
                  value={values.showtime_status_id}
                  onChange={(val) => setFieldValue("showtime_status_id", val)}
                  options={
                    statuses?.map((status: any) => ({
                      label: status.name,
                      value: status.showtime_status_id,
                    })) || []
                  }
                  defaultOption="Select status (e.g. Scheduled)"
                  required
                />
              </div>
            </div>

            {/* Section 2: Date & Showtime Slots */}
            <FieldArray name="schedules">
              {({ push, remove }) => (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#c77e3b]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        2. Screening Dates & Time Slots
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] font-semibold">
                        {values.schedules.length}
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="xs"
                      title="Add Date"
                      variant="outline"
                      icon={<Plus size={14} />}
                      onClick={() => push({ date: "", times: [] })}
                    />
                  </div>

                  {values.schedules.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 text-center py-7 px-4">
                      <Calendar className="w-6 h-6 text-[#c77e3b] mx-auto mb-1.5" />
                      <p className="text-sm font-semibold text-stone-700">
                        No screening dates added yet
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Click <strong>Add Date</strong> to pick screening dates
                        and time slots.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                      {values.schedules.map((item: any, index: number) => {
                        const disabledTimes = duration
                          ? getDisabledTimeSlots(item.times || [], duration)
                          : [];

                        return (
                          <div
                            key={index}
                            className="border border-stone-200/90 p-4 rounded-2xl space-y-3.5 bg-white shadow-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#754f2c] bg-[#fff8ea] border border-[#c77e3b]/25 px-2.5 py-0.5 rounded-full">
                                Schedule #{index + 1}
                              </span>
                              {values.schedules.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 cursor-pointer"
                                >
                                  <Trash2 size={13} /> Remove
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                              <div className="sm:col-span-5">
                                <Input
                                  label="Show Date"
                                  name={`schedules[${index}].date`}
                                  type="date"
                                  value={item.date}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    touched.schedules?.[index] &&
                                    errors.schedules?.[index] &&
                                    typeof errors.schedules[index] ===
                                      "object" &&
                                    "date" in errors.schedules[index]
                                      ? (errors.schedules[index] as any).date
                                      : undefined
                                  }
                                  required
                                  restrictPastDate
                                />
                              </div>

                              <div className="sm:col-span-7">
                                <ReusableSelect
                                  mode="multiple"
                                  label="Start Times"
                                  name={`schedules[${index}].times`}
                                  options={allSlots.map((t) => {
                                    const isSelected = (
                                      item.times || []
                                    ).includes(t);
                                    const slotMinutes = timeToMinutes(t);
                                    const nowMinutes = getNowMinutes();
                                    const pastTimeToday =
                                      isToday(item.date) &&
                                      slotMinutes <= nowMinutes;
                                    const isOverlapDisabled =
                                      disabledTimes.includes(t);
                                    const isDisabled =
                                      (pastTimeToday || isOverlapDisabled) &&
                                      !isSelected;

                                    return {
                                      label: isSelected
                                        ? t
                                        : pastTimeToday
                                        ? `${t} (Past time)`
                                        : isOverlapDisabled
                                        ? `${t} (Overlaps active show)`
                                        : t,
                                      value: t,
                                      disabled: isDisabled,
                                    };
                                  })}
                                  value={item.times || []}
                                  onChange={(vals: any) => {
                                    const currentTimes = item.times || [];
                                    if (vals.length > currentTimes.length) {
                                      const newTime = vals.find(
                                        (t: string) =>
                                          !currentTimes.includes(t)
                                      );
                                      if (newTime) {
                                        const slotMinutes =
                                          timeToMinutes(newTime);
                                        const nowMinutes = getNowMinutes();
                                        if (
                                          isToday(item.date) &&
                                          slotMinutes <= nowMinutes
                                        ) {
                                          return;
                                        }
                                        const wouldOverlap =
                                          !isTimeSlotAvailable(
                                            newTime,
                                            currentTimes,
                                            duration
                                          );
                                        if (wouldOverlap) return;
                                      }
                                    }
                                    setFieldValue(
                                      `schedules[${index}].times`,
                                      vals
                                    );
                                  }}
                                  defaultOption="Select one or more start times"
                                  required
                                />
                              </div>
                            </div>

                            {item.times?.length > 0 && duration > 0 && (
                              <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-stone-400 mr-1">
                                  Screenings:
                                </span>
                                {item.times.map((time: string) => {
                                  const startMinutes = timeToMinutes(time);
                                  const endMinutes = startMinutes + duration;
                                  const endTime = minutesToTime(endMinutes);
                                  return (
                                    <span
                                      key={time}
                                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#fff8ea] border border-[#c77e3b]/30 text-xs font-semibold text-[#754f2c]"
                                    >
                                      <Clock size={11} />
                                      {time} → {endTime}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </FieldArray>

            {/* FOOTER */}
            <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-stone-200/80">
              <Button
                type="button"
                title="Cancel"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                className="min-w-[160px]"
                loading={isSubmitting}
                disabled={isSubmitting}
                title={
                  isSubmitting
                    ? editMode
                      ? "Updating..."
                      : "Creating..."
                    : editMode
                    ? "Save Showtime"
                    : "Create Showtime"
                }
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
