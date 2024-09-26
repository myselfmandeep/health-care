import { showErrorInNotificationCard } from "../general/helper_methods";
import { removeSpinner } from "../general/spinner";
import { doctorSearchField } from "./listing";

const searchBtn = document.querySelector("#search-button");

searchBtn.addEventListener("click", (event) => {
  const value = doctorSearchField.value;
  const errors = []
  if (!value) {
    errors.push("Search field can't be blank")
  } else if(value.length < 3) {
    errors.push("Search field must have minimum 3 characters")
  }
  if (errors.length == 0) {
    location.href = `/doctors/search?query=${value}`;
  } else {
    showErrorInNotificationCard(errors, 5000);
    removeSpinner();
  }
});
