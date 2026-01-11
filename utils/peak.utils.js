
const PEAK_START_HOUR = 18; 
const PEAK_END_HOUR = 21;  

export const isPeakHour = (date) => {
  const hour = date.getHours(); // local hour (0–23)
  return hour >= PEAK_START_HOUR && hour < PEAK_END_HOUR;
};