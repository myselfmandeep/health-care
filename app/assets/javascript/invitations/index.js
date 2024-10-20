import { showErrorInNotificationCard } from "../general/helper_methods";

const inputSearchUser = document.querySelector(".search-invited-user");
const searchBtn = document.querySelector(".search-invited-user-btn");

searchBtn.addEventListener("click", function(event) {
  const value = inputSearchUser.value;

  if (!value) {
    return showErrorInNotificationCard("Search field can't be blank")
  } else if (value.length < 3) {
    return showErrorInNotificationCard("Minimum 3 characters required")
  } else if (value.length > 25) {
    return showErrorInNotificationCard(`Maximum 25 characters are allowed. Meanwhile you have provided a lenght of ${value.length} charactes.`)
  }

  const params =  new URLSearchParams(window.location.search);

  params.delete("page")
  params.delete("per_page")
  location.href = `?${params.toString()}&query=${value}`
});