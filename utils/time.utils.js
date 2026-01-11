// utils/time.utils.js

export const calculateEndTime = (startTime, durationMinutes) => {
  const end = new Date(startTime);
  end.setMinutes(end.getMinutes() + durationMinutes); // ⚠️ Use minutes, not hours!
  return end;
};

export const isWithinOperatingHours = (startTime, endTime, opensAt, closesAt) => {
  const startHour = startTime.getHours(); // e.g. 21 for 9 PM
  const endHour = endTime.getHours();     // e.g. 22 for 10 PM

  // Simple case: reservation starts and ends on same day within open hours
  if (startHour >= opensAt && endHour <= closesAt) {
    return true;
  }

  // Optional: handle cross-midnight (e.g., opens 10, closes 2 AM next day)
  // For now, assume same-day only (most restaurants)
  return false;
};
