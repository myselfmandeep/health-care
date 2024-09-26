export function generateTimeSlots(startTime, endTime, slotDuration) {
  const timeSlots = [];

  let currentTime = new Date(`1970-01-01T${startTime}:00`);
  const endTimeDate = new Date(`1970-01-01T${endTime}:00`);

  while (currentTime < endTimeDate) {
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    timeSlots.push(`${hours}:${minutes}`);

    currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
  }

  return timeSlots;
}
