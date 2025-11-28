/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form, FieldArray } from "formik";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import Input from "../../../components/shared/Input";
import { useAppDispatch } from "../../../store/hook";
import { createShowtime, updateShowtime } from "../../../store/slices/showtime";
import { toast } from "react-toastify";

// Generate slots every 30 minutes
function generateHalfHourSlots() {
  const result: string[] = [];
  for (let h = 0; h < 24; h++) {
    result.push(`${String(h).padStart(2, "0")}:00`);
    result.push(`${String(h).padStart(2, "0")}:30`);
  }
  return result;
}

// Convert time string to minutes
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Convert minutes back to time string
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Get disabled time slots based on selected times and movie duration
function getDisabledTimeSlots(
  selectedTimes: string[],
  duration: number
): string[] {
  const disabled = new Set<string>();
  const allSlots = generateHalfHourSlots();

  selectedTimes.forEach((startTime) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + duration;

    // Disable all slots from start time until end time (exclusive of end)
    allSlots.forEach((slot) => {
      const slotMinutes = timeToMinutes(slot);

      // If slot falls within the movie runtime (including the start time)
      if (slotMinutes >= startMinutes && slotMinutes < endMinutes) {
        disabled.add(slot);
      }
    });
  });

  return Array.from(disabled);
}

// Check if a time slot can be selected without overlapping
function isTimeSlotAvailable(
  time: string,
  selectedTimes: string[],
  duration: number
): boolean {
  const newStartMinutes = timeToMinutes(time);
  const newEndMinutes = newStartMinutes + duration;

  // Check against all already selected times
  for (const selectedTime of selectedTimes) {
    const selectedStartMinutes = timeToMinutes(selectedTime);
    const selectedEndMinutes = selectedStartMinutes + duration;

    // Check for overlap
    // New movie starts during existing movie OR existing movie starts during new movie
    if (
      (newStartMinutes >= selectedStartMinutes &&
        newStartMinutes < selectedEndMinutes) ||
      (selectedStartMinutes >= newStartMinutes &&
        selectedStartMinutes < newEndMinutes)
    ) {
      return false;
    }
  }

  return true;
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
                onChange={(val) => setFieldValue("cinema_id", val)}
                options={cinemaOptions}
                defaultOption="Select cinema"
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
            <FieldArray name="showtimes">
              {({ push, remove }) => (
                <div className="h-60 overflow-y-scroll space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium font-sans">Showtimes</p>
                    <Button
                      type="button"
                      title="Add Date"
                      variant="secondary"
                      onClick={() => push({ date: "", times: [] })}
                      className="rounded-md"
                    />
                  </div>

                  {values.showtimes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground font-serif">
                      No showtimes added yet. Click "Add Date" to get started.
                    </div>
                  )}

                  {values.showtimes.map((item: any, index: number) => {
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
                          name={`showtimes[${index}].date`}
                          type="date"
                          value={item.date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.showtimes?.[index] &&
                            errors.showtimes?.[index] &&
                            typeof errors.showtimes[index] === "object" &&
                            "date" in errors.showtimes[index]
                              ? (errors.showtimes[index] as any).date
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
                            name={`showtimes[${index}].times`}
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
                                  `showtimes[${index}].times`,
                                  vals
                                );
                              } else {
                                // Removing a time - always allow
                                setFieldValue(
                                  `showtimes[${index}].times`,
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
