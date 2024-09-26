import { showErrorInNotificationCard } from "../general/helper_methods";

const hospitalSearchField  = document.querySelector("#hospital-search-field");
const hospitals = [...document.querySelectorAll("[data-hospital-name]")];
const resetFilterBtn = document.querySelector("#reset-filter-button");
const searchBtn = document.querySelector("#search-button");

const hideElement = function(element) {
  element.style.display = "none"
};

const showElement = function(element) {
  element.style.display = ""
};

hospitalSearchField.addEventListener("keyup", function(event) {
  const value = hospitalSearchField.value.toLowerCase().trim();
  
  hospitals.forEach(function(hospital) {
    const hospitalName = hospital.dataset.hospitalName.toLowerCase();
    hospitalName.includes(value) ? showElement(hospital) : hideElement(hospital)
  })
});

resetFilterBtn.addEventListener("click", () => {
  hospitals.forEach(doc => showElement(doc));

  if (!!location.search) {
    console.log(location.search);
    location.href = "/hospitals";
  }
  
});

searchBtn.addEventListener("click", (event) => {
  const value = hospitalSearchField.value;
  const errors = []
  if (!value) {
    errors.push("Search field can't be blank")
  } else if(value.length < 3) {
    errors.push("Search field must have minimum 3 characters")
  }
  if (!errors.length) {
    location.href = `/hospitals/search?query=${value}`;
  } else {
    showErrorInNotificationCard(errors, 5000);
  }
});