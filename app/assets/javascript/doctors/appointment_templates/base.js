
const tableRows = document.querySelectorAll(".table-rows");
async function changeStatus(event) {

  const element = event.target
  const dataSet = element.dataset
  const confirmedAction = confirm(`Are you sure want to ${dataSet.appointmentStatus} this appointment request!`)

  if (!confirmedAction) { return };
  const path     = `/api/v1/appointments/${dataSet.appointmentId}/change_status?status=${dataSet.appointmentStatus}`
  const response = await fetch(path, {method: "PUT"})
  
  if (response.ok) {
    const appointment = await response.json();
    const appointmentId = appointment.id
    const appointmentStatus = document.querySelector(`#appointment-status-${appointmentId}`);
    appointmentStatus.innerHTML = appointment.status;

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
    console.log(response);
  };

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

const appointmentsRows = [...document.querySelectorAll("[data-appointment-date]")];
const dateOfAppointment = document.querySelector("#date-of-appointment");
const resetFilterBtn = document.querySelector("#reset-filter-button");
const hideElement = (element) => element.style.display = "none";
const showElement = (element) => element.style.display = "";

dateOfAppointment.addEventListener("change", function(event) {
  const date = event.currentTarget.value

  appointmentsRows.forEach((appointment) => {
    const dataSet = appointment.dataset;
    const dDate   = dataSet.appointmentDate

    date == dDate ? showElement(appointment) : hideElement(appointment);
  });
  
});

console.log(appointmentsRows);
resetFilterBtn.addEventListener("click", function(event) {
  appointmentsRows.forEach(app => showElement(app))
});