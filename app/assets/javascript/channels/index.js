import { createConsumer } from "./consumer";
import getToken from "../auth/get_token";
import { fadeOutElement, getBody, showSuccessInNotificationCard } from "../general/helper_methods";

getToken();

class Channel {

  static initiateChannel() {
    const channel = new this();
    const identifier = {channel: "NotificationChannel", user_id: localStorage.user_id}
    return createConsumer().subscriptions.create(identifier, {})
  };

  static doctorNotification(data) {
    const notificationBar = document.querySelector("#doctor-notifications");
    if (!notificationBar) { return };
    const message = `<li>you have new appointment request from ${data.patient} for slot ${data.timeslot} on ${data.date}</li>`;
    notificationBar.insertAdjacentHTML("beforeend", message)
  }

  static displayNotification(data) {
    // const notificationId = (new Date()).getTime();
    // const notificationContainer = document.querySelector(".notification-container");
    // const type = data.type
    // const seeRequest = `<div class="new_appointment">See Requests</div>`
    // const notificationAlert     = `
    //   <div class="notification-alert" id="${notificationId}">
    //     <p>${data.message}</p>
    //     ${type == "new_appointment" ? seeRequest : ""}
    //   </div>
    // `;
    // notificationContainer.insertAdjacentHTML("beforeend", notificationAlert);
    // const currentNotification = document.getElementById(`${notificationId}`);
    // const btn = currentNotification.querySelector(".new_appointment")

    // if (btn) {
    //   btn.addEventListener("click", (e)=> {
    //     // location.href = `/doctors/${data.doctor_id}/appointments?status=requested`;
    //     location.href = "/appointments"
    //   })
    // };

    // // const parentNotificationContainer = document.querySelector(".parent-notification-container");
    // const notificationCloseBtn = document.querySelector(".notifications-close-btn");
    // const notification = `
    //   <div class="single-notification">
    //     <p>
    //       ${data.message}
    //     </p>
    //   </div>
    // `;
    // // parentNotificationContainer.insertAdjacentHTML("afterbegin", notification);
    // notificationCloseBtn.insertAdjacentHTML("afterend", notification)

    // setTimeout(() => {fadeOutElement(currentNotification)}, 4000);

    showSuccessInNotificationCard(data.message, 3500)
  }
};

let notifyChannel;
if (localStorage.user_id) { 
  const subscription = Channel.initiateChannel();
  notifyChannel = subscription;
  window.sub = subscription;
  subscription.connected = function () {
    console.log("/cable connection successfully");
  };

  subscription.received = function (data) {
    // console.log(data);
  
   switch (data.type) {
    case "new_message":
      const chatScreen = document.querySelector(`[active-chat="${data.chat_id}"]`);
      const newChatBtn = document.querySelector(".new-chat-btn");
      if (!chatScreen) {
        showSuccessInNotificationCard(`You have received new message from ${data.sender.name}`);
      }
      if (!!newChatBtn) {
        const chatUser = document.querySelector(`[data-chat-id="${data.chat_id}"]`);
        newChatBtn.insertAdjacentElement("afterend", chatUser)
      }
      break;
    case "ping":
      console.log(data);
      break
    case "close_connection":
      const timestampid = (new Date()).getTime();
      subscription.perform("close_connection", {timestampId: timestampid})
      localStorage.setItem("timestamp_id", timestampid)
      break
    case "user_sign_out":
      if (data.timestampId == localStorage.timestamp_id) {
        subscription.unsubscribe();
        console.log("unsubscribed successfully");
        // localStorage.removeItem("timestamp_id");
      }
    break;
    default:
      Channel.displayNotification(data);
      break;
   }
  };
};

// getBody().addEventListener("click", () => {notifyChannel})
// setTimeout(() => {
// }, 1500);
console.log(notifyChannel);
export { notifyChannel }