// Generate slots every 30 minutes
export function generateHalfHourSlots() {
  const result: string[] = [];
  for (let h = 0; h < 24; h++) {
    result.push(`${String(h).padStart(2, "0")}:00`);
    result.push(`${String(h).padStart(2, "0")}:30`);
  }
  return result;
}

// Convert time string to minutes
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Convert minutes back to time string
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Get disabled time slots based on selected times and movie duration
export function getDisabledTimeSlots(
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
export function isTimeSlotAvailable(
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

export const getNowMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const isToday = (date: string) => {
  if (!date) return false;
  const today = new Date();
  const selected = new Date(date);
  return (
    today.getFullYear() === selected.getFullYear() &&
    today.getMonth() === selected.getMonth() &&
    today.getDate() === selected.getDate()
  );
};
