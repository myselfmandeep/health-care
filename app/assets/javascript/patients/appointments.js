const detailBtns = [...document.querySelectorAll(".detail-btn")]; 

detailBtns.forEach(function(btn) {

  btn.addEventListener("click", function(event) {
    const element = event.currentTarget;
    const detailCard = document.querySelector(`#appointment-detail-${element.dataset.appointmentId}`);

    detailCard.style.display = "block";

    const closeBtn = detailCard.querySelector(".close-btn");

    closeBtn.addEventListener("click", function(event) {
      event.stopImmediatePropagation;

      detailCard.style.display = "";
    });
  });
  
});

const doctorSearchField  = document.querySelector("#doctor-search-field");
const doctors = [...document.querySelectorAll("[data-doctor-name]")];
const resetFilterBtn = document.querySelector("#reset-filter-button");

console.log(doctors);

doctorSearchField.value = "";

const hideElement = function(element) {
  element.style.display = "none";
};

const showElement = function(element) {
  element.style.display = "";
};

doctorSearchField.addEventListener("keyup", function(event) {
  const value = doctorSearchField.value.toLowerCase().trim();
  
  doctors.forEach(function(doctor) {
    const doctorName = doctor.dataset.doctorName.toLowerCase();

    
    doctorName.includes(value) ? showElement(doctor) : hideElement(doctor)
  });

});

resetFilterBtn.addEventListener("click", () => {
  doctors.forEach(doc => showElement(doc));
});