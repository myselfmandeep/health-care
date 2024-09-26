import { reqHeaders, showApiResponse, showErrorInNotificationCard, showSuccessInNotificationCard } from "../../../general/helper_methods";

const statusBtns = [...document.querySelectorAll("[data-user-change-state]")]
statusBtns.forEach(actionBtn => {
  const dataSet = actionBtn.dataset
  actionBtn.addEventListener("click", async function(event) {
    const button = event.currentTarget;
    const acState = {active: "active", suspend: "suspended"};
    const currentState = dataSet.userChangeState;
    const userId = dataSet.userId;
    const state = currentState == acState.active ? acState.suspend : acState.active
    console.log(button);
    const sureToChangeStatus = confirm(`Are you sure you want to mark ${state} this user?`);
    if (!sureToChangeStatus) { return };
    try {
      const path = `/api/v1/users/${userId}/account_status/?state=${state}`
      const response = await fetch(path, reqHeaders("PUT"))
      const userState = await response.json();

      console.log(userState);
      console.log(response);
      
      if (response.ok) {
        // debugger;
        // console.log(userState);
        if (userState.state == acState.suspend) {
          button.classList.remove("btn-warning")
          button.classList.add("btn-success");
          button.setAttribute("data-user-change-state", acState.suspend)
          button.textContent = "activate"
        } else {
          button.classList.remove("btn-success")
          button.classList.add("btn-warning");
          button.setAttribute("data-user-change-state", acState.active)
          button.textContent = "suspend"
        };
        showSuccessInNotificationCard(`${userState.name} has been marked ${userState.state} successfully`)
      }else {
        const errors = [`Failed to mark ${state} to user due to following reasons:`, userState]
        showErrorInNotificationCard(errors, 7000)
        // showApiResponse(userState.errors)
      };
    } catch (error) {
      showApiResponse(error)
      console.log(error);
    };
    console.log(dataSet);
  });
});