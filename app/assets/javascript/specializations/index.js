import { showErrorInNotificationCard } from "../general/helper_methods";
import { removeSpinner } from "../general/spinner";

console.log("hospital specializations");

const specializationSearchField  = document.querySelector("#specialization-search-field");
const specializations = [...document.querySelectorAll("[data-specialization-name]")];
const resetFilterBtn = document.querySelector("#reset-filter-button");
const searchBtn = document.querySelector("#search-button");

specializationSearchField.value = "";
const hideElement = function(element) {
  element.style.display = "none";
};

const showElement = function(element) {
  element.style.display = "";
};

specializationSearchField.addEventListener("keyup", function(event) {
  const value = specializationSearchField.value.toLowerCase().trim();
  
  specializations.forEach(function(specialization) {
    const specializationName = specialization.dataset.specializationName.toLowerCase();
    specializationName.includes(value) ? showElement(specialization) : hideElement(specialization)
  });
});

resetFilterBtn.addEventListener("click", () => {
  specializations.forEach(doc => showElement(doc));

  if (!!location.search) {
    console.log(location.search);
    location.href = "/specializations";
  }
});

searchBtn.addEventListener("click", (event) => {
  const value = specializationSearchField.value;
  const errors = []
  if (!value) {
    errors.push("Search field can't be blank")
  } else if(value.length < 3) {
    errors.push("Search field must have minimum 3 characters")
  }
  if (!errors.length) {
    location.href = `/specializations/search?query=${value}`;
  } else {
    showErrorInNotificationCard(errors, 5000);
    removeSpinner()
  }
});