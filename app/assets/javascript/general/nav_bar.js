import { showApiResponse } from "./helper_methods";



// notificationModal.addEventListener("click", (event) => { style.display = "none"
//   event.target.;
// });

try {
  const notificationModal = document.querySelector(".notifications-modal");
  const hideNotificationModal = () => { notificationModal.style.display = "none" };
  const notificationNavBar = document.querySelector(".notifications-nav-bar");
  const parentNotificationContainer = notificationNavBar.querySelector(".parent-notification-container");
  const parentProfileModal = document.querySelector(".profile-parent-modal");
  parentNotificationContainer.scrollTop = 5;

  console.log(parentProfileModal);
  // const showNotifications = (event) => {
  //   if (event.target == notificationModal) {
  //     const state = notificationModal.style.display;
  //     notificationModal.style.display = state == "" ? "none" : "";
  //   } else {

  //   }
  //   // if (event.target !== event.currentTarget) { return };  
  //   // const element = event.currentTarget;
  //   // const data = element.dataset
  //   // if (data.visible == "false") {
  //   //   notificationNavBar.setAttribute("data-visible", "true")
  //   //   parentNotificationContainer.style.display = "block";
  //   // } else {
  //   //   parentNotificationContainer.style.display = "none";
  //   //   notificationNavBar.setAttribute("data-visible", "false")
  //   // };

  // };

  
  notificationNavBar.addEventListener("click", (event) => {
    event.stopPropagation();
    if (event.currentTarget == notificationNavBar) {
      console.log("child element");
      notificationModal.style.display = "block";
    }
  });
  
  notificationModal.addEventListener("click", (event) => {
    event.stopPropagation();
    if (event.target === notificationModal) {
      notificationModal.style.display = "none";
      console.log(notificationModal);
      console.log("parrent nomodal event");
    }
  });


  
  let pageNo = 1
  let nextPage = 2
  parentNotificationContainer.addEventListener("scroll", async function(event) {
    const currentElement = event.currentTarget;
    const currentScrollPosition = currentElement.scrollTop + currentElement.clientHeight;
    const containerHeight = currentElement.scrollHeight;  
    if (currentScrollPosition >= containerHeight && !!nextPage) {
      const sixtyPercentHeight = containerHeight * 0.60;
      currentElement.scrollTop = sixtyPercentHeight;
      try {
        pageNo++
        const path = `/api/v1/notifications?page=${pageNo}`
        const headers = {headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.token}` } }
        const response = await fetch(path, headers);
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          data.notifications.forEach(notification => {
            const notify = `
              <div class="single-notification">
                <p>
                  ${notification.content}
                </p>
              </div>
            `;
            currentElement.insertAdjacentHTML("beforeend", notify)
          });
          nextPage = data.meta.next_page
        } else {
          showApiResponse("Please login to perform this action");
          pageNo--
        };
      } catch(error) {
        console.error(error)
        showApiResponse("Something went wrong. Please try again later")
      };
    }
  });
  const notificationCloseBtn = document.querySelector(".notifications-close-btn");
  notificationCloseBtn.addEventListener("click", () => {
    hideNotificationModal();
  })

  parentProfileModal.addEventListener("click", (event) => {
    if(event.target == parentProfileModal) {
      console.log("profile modal has been clikd");
      parentProfileModal.style.display = "none";
    }  
  })  
  
  
  const logInType = document.querySelector(".logged-in-type");
  const profileModal = document.querySelector(".profile-modal");
  logInType.addEventListener("click", function(event) {
    event.stopImmediatePropagation();
    if (logInType == event.target) {
      parentProfileModal.style.display = "block";
    }
  })

} catch (error) {
  console.log(error);
}  

