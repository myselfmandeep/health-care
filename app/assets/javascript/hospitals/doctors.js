console.log("hospital doctors");

const doctorSearchField  = document.querySelector("#doctor-search-field");
const doctors = [...document.querySelectorAll("[data-doctor-name]")];
const resetFilterBtn = document.querySelector("#reset-filter-button");

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

const chatWithDrBtn = [...document.querySelectorAll(".chat-with-doctor")];
chatWithDrBtn.forEach(btn => {
  
  btn.addEventListener("click", (event) => {
    // event.preventDefault();
    const chatBtn = event.currentTarget;
    const drId = chatBtn.dataset.doctorId;
    const drName = chatBtn.dataset.doctorName;
  
    console.log(drId);
    localStorage.setItem("requestedChat", drId)
    localStorage.setItem("requestedUserName", drName)
  })
});
