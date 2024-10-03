import { defaultErrorMessage, get_user_id, reqHeaders, showErrorInNotificationCard, showSuccessInNotificationCard } from "../general/helper_methods";

console.log("dffee");
const feedbackText = document.querySelector(".fb-text");
// const apptID = document.querySelector("#appt-id");
const submitFeedback = document.querySelector(".submit-feedback");

submitFeedback.addEventListener("click", async function(event) {
  const text = feedbackText.value;
  const apptId = event.currentTarget.dataset.apptId;
  const errors = {};

  if (!text) {
    errors.notPresent = "Please proivde the feeback";
  }
  if (text.length < 10) {
    errors.fbLength = "Minimum lenght of 10 characters is required";
  }
  if (text.length > 650) {
    errors.overLength = "Maximun length of 650 character is allowed";
  }
  if (Object.keys(errors).length > 0) {
    return showErrorInNotificationCard(errors)
  }
  try {
    const path = `/api/v1/feedbacks?body=${feedbackText.value}&appt_id=${apptId}&user=${get_user_id()}`
    const response = await fetch(path, reqHeaders("POST"));
    const feedback = await response.json();

    console.log(feedback);
    if (response.ok) {
      feedbackText.value = "";
      showSuccessInNotificationCard("Thanks for your value able feedback");
      setTimeout(() => {
        window.location.replace("/");
      }, 3000)
    } else {
      showErrorInNotificationCard(feedback)
    }

  } catch (error) {
    defaultErrorMessage(error)
  }

});