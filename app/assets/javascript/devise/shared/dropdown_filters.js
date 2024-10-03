const filterBtn = document.querySelector(".filter-btn");
const hideDropDown = document.querySelector(".hide-dropdown");
const dropdownOpts = document.querySelector(".dropdown-options");

filterBtn.addEventListener("click", (e) => {
  console.log("hello filterbtn");
  hideDropDown.style.display = "block";
  dropdownOpts.style.display = "block";
})

hideDropDown.addEventListener("click", (e) => {
  console.log("hello hiddorpdown");
  if (e.target == hideDropDown) {
    hideDropDown.style.display = "none";
    dropdownOpts.style.display = "none";
  }
})