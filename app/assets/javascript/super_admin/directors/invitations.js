import { reqHeaders, showErrorInNotificationCard, showSuccessInNotificationCard } from "../../general/helper_methods";
import { removeSpinner, showSpinner } from "../../general/spinner";

console.log("Invitations");

const inviteEmail = document.querySelector(".invite-email");
const inviteSendButton = document.querySelector(".send-invite-btn");

inviteSendButton.addEventListener("click", async function(event) {
  
  try {
    showSpinner();
    const recipient = inviteEmail.value;
    console.log(recipient);

    if (!recipient) {
      return showErrorInNotificationCard("Email Not provided")
    }
    
    const path = `/api/v1/invitations?email=${recipient}`
    const response = await fetch(path, reqHeaders("POST"));
    const invitation = await response.json();

    if (response.ok) {
      showSuccessInNotificationCard(`Successfully Sent invitation to the ${recipient}`)
      inviteEmail.value = "";
      setTimeout(() => {
        location.href = "/invitations"
      }, 3500)
    } else {
      showErrorInNotificationCard([`Failed to send invitation to ${recipient}`, invitation], 7000)

    }
    
  } catch (error) {
    showErrorInNotificationCard(error.message) 
  } finally {
    removeSpinner();
  }

  
  // console.log(recipient);

  // showErrorInNotificationCard(recipient.message)
  // console.log(event);
})