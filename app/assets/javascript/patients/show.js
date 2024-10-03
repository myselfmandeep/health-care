import { chatSeeker } from "../general/helper_methods";

const previousPage = document.querySelector("#go-to-previous-page");
const chatWithDrBtn = [...document.querySelectorAll(".chat-with-doctor")];

// const body = document.querySelector("body").style.background = "#1b1b1b8a";
previousPage.addEventListener("click", function(event) {
  console.log("clicked prevous page");
  window.history.back();
});

chatWithDrBtn.forEach(btn => {
  btn.addEventListener("click", chatSeeker);
});