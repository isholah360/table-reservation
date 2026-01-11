

export const calculateEndTime = (startTime, durationMinutes) => {
  const end = new Date(startTime);
  end.setMinutes(end.getMinutes() + durationMinutes); 
  return end;
};

export const isWithinOperatingHours = (startTime, endTime, opensAt, closesAt) => {
  const startHour = startTime.getHours(); 
  const endHour = endTime.getHours();    

  if (startHour >= opensAt && endHour <= closesAt) {
    return true;
  }
  return false;
};
