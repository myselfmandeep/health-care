import { showApiResponse } from "../general/helper_methods";
import { removeSpinner, showSpinner } from "../general/spinner";

console.log("hello wordl");

const tableRows = document.querySelectorAll(".table-rows");
const selectStatus = document.querySelector("#select-status");

async function changeStatus(event) {

  const element = event.target
  const dataSet = element.dataset

  const confirmedAction = confirm(`Are you sure want to ${dataSet.appointmentStatus} this appointment request!`)
  
  if (!confirmedAction) { return };
  
  try {
    showSpinner();
    const path     = `/api/v1/appointments/${dataSet.appointmentId}/change_status?status=${dataSet.appointmentStatus}`
    const response = await fetch(path, {method: "PUT"})
    const appointment = await response.json();
    console.log(appointment);
    if (response.ok) {
      const appointmentId = appointment.id;
      const appointmentStatus = document.querySelector(`#appointment-status-${appointmentId}`);

      appointmentStatus.innerHTML = appointment.status;
      
      console.log(appointment);

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
      // button.textContent = "N/A";
      button.textContent = "Already taken";

      button.setAttribute("data-action-taken", true)
      
    } else {
      console.log(appointment);
      if (!!appointment.error) {showApiResponse(appointment.error)}
    };
    
    removeSpinner();
    console.log(dataSet);
  } catch (error) {
    showApiResponse("something went wrong")
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
    console.log(appointmentId);
    
    const approveBtn = appointmentDetail.querySelector("#approve-btn");
    const rejectBtn  = appointmentDetail.querySelector("#reject-btn");
    const cancelBtn  = appointmentDetail.querySelector("#cancel-btn");
    
    cancelBtn.addEventListener("click", function(event) {
      appointmentDetail.classList.add("appointment-detail");
    });

    approveBtn.addEventListener("click", changeStatus);
    rejectBtn.addEventListener("click", changeStatus);

    console.log(approveBtn, rejectBtn, cancelBtn);
    
  });
});

console.log(appointmentActionBtns);