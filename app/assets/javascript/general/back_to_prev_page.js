const previousPage = document.querySelector("#go-to-previous-page");
previousPage.addEventListener("click", function(event) {
  console.log("clicked prevous page");
  window.history.back();
});
