import { fadeOutElement, showApiResponse } from "../../general/helper_methods";

console.log("confirmed js");

async function changeStatus(event) {

  const element = event.target
  const dataSet = element.dataset

  const appointmentToCancel = document.querySelector(`#cancellation-reason-${dataSet.appointmentId}`)
  const visibility = appointmentToCancel.style.display;

  if ( visibility == "none" || visibility == "") {
    appointmentToCancel.style.display = "block";

    element.textContent = "Submit"
    
    return;
  }
  
  // const cancellationReason = prompt("Reason of cancellation")
  // if (!cancellationReason) {alert("Reason is required"); return};

  const cancellationReason = appointmentToCancel.value;

  if (cancellationReason.length == 0) {
    //  showApiResponse("Please describe the cancellation reason"); 
    const id = `reason-${Math.round(Math.random() * 100000)}`
    appointmentToCancel.insertAdjacentHTML("afterend", `<p id="${id}" style="color:red;">Please describe the cancellation reason</p>`);
    
    fadeOutElement(document.querySelector(`#${id}`), 5000);
    return;
  }
  
  // if (!cancellationReason) {alert("Reason is required"); return};
  
  const confirmedAction = confirm(`Are you sure want to ${dataSet.appointmentStatus} this appointment!`)
  if (!confirmedAction) { return };
  
  try {
    const cancelledAt = new Date();
    const path     = `/api/v1/appointments/${dataSet.appointmentId}/change_status?status=cancelled&cancelled_at=${cancelledAt}&cancellation_reason=${cancellationReason}`
    const response = await fetch(path, {method: "PUT"})
    const appointment = await response.json();
    
    if (response.ok) {
      const appointmentId = appointment.id
      const appointmentStatus = document.querySelector(`#appointment-status-${appointmentId}`);

      appointmentStatus.innerHTML = appointment.status;
      
      console.log(appointment)

      const appointmentRow = document.querySelector(`#appointment-${appointmentId}`);
      const appointmentDetail = document.querySelector(`#appointment-detail-${appointmentId}`);
      
      appointmentDetail.remove();

      appointmentRow.classList.remove("table-warning")
      
      if (appointment.status == "rejected") {
        appointmentRow.classList.add("table-danger");
      } else if (appointment.status == "confirmed") {
        appointmentRow.classList.add("table-success");
      }
      
      const button = document.querySelector(`[data-appointment-id='${appointmentId}']`);
      button.textContent = "N/A";

      button.setAttribute("data-action-taken", true)
      
    } else {
      if (!!appointment.error) {showApiResponse(appointment.error)};
      showApiResponse("Something went wrong")
      console.log(response);
    };
    
    // console.log(dataSet);
  } catch (error) {
    showApiResponse("Something went wrong please try again later")
    console.log(error);
  }
};

const appointmentActionBtns = [...document.querySelectorAll(".action-btn")];

appointmentActionBtns.forEach(function(actionBtn) {

  actionBtn.addEventListener("click", function(event) {
    const button = event.target;
    const dataset = button.dataset
    console.log(dataset);

    if (dataset.actionTaken == "true") {return};
    
    const appointmentId = dataset.appointmentId;

    const appointmentDetail = document.querySelector(`#appointment-detail-${appointmentId}`);

    appointmentDetail.classList.remove("appointment-detail");
    // console.log(appoi);
    console.log(appointmentId);
    
    const cancelBtn  = appointmentDetail.querySelector("#cancel-btn");
    const closeBtn  = appointmentDetail.querySelector("#close-btn");

    
    closeBtn.addEventListener("click", function(event) {
      appointmentDetail.classList.add("appointment-detail");
    });

    cancelBtn.addEventListener("click", changeStatus);

    // console.log(approveBtn, rejectBtn, closeBtn);

  });
});

console.log(appointmentActionBtns);