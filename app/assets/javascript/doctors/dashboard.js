// console.log("hello doctor dashboard");

const timeSlots = [...document.querySelectorAll(".booked-timeslot")]
timeSlots.forEach(function(slot) {
  slot.addEventListener("click", function(event) {
    const element = event.currentTarget
    const dataSet = element.dataset
    const uniqueSlotId = `#slot-detail-${dataSet.slotId}`;
    const slotDetail = document.querySelector(uniqueSlotId);
    slotDetail.style.display = "flex";
    const closeBtn = slotDetail.querySelector(".close-patient-detail-btn");
    closeBtn.addEventListener("click", function(event) {
      slotDetail.style.display = "none";
    });
  })
}); 

console.log(timeSlots);