const logInType = document.querySelector(".logged-in-type");
const profileModal = document.querySelector(".profile-modal");

logInType.addEventListener("click", function(event) {
  if (logInType == event.target) {
    const state = profileModal.style.display;
    profileModal.style.display = state == "none" || !state ? "flex" : "none"; 
  }
})
