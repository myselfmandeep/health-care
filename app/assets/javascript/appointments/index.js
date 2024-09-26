import { appointmentRows } from "../components/appointments/appointment_rows";
import { seeDetailModal } from "../components/appointments/see_detail_modal";
import { closeModal, closeModal1, defaultErrorMessage, reqHeaders, showErrorInNotificationCard, showSuccessInNotificationCard } from "../general/helper_methods";
import { removeSpinner, showSpinner } from "../general/spinner";

console.log("test");

const apptTypes = [...document.querySelectorAll(".appts-type")];
const tbody = document.querySelector(".appts-table-body");
const tableContainer = document.querySelector(".appts-rows");
const selectedClass = "selected-appt-section";
const filterBtn = document.querySelector(".filter-button");
const doctorFilterDate = document.querySelector(".doctor-filter-name");
const patientNameFilter = document.querySelector(".patient-filter-name");
const dateFilter = document.querySelector("#filter-date");
const timeFilter = document.querySelector("#filter-time");
const resetFilterBtn = document.querySelector(".reset-button");
const filterOrder = document.querySelector("#filter-order");
const filterPerPage = document.querySelector("#filter-per-page");

let pageNo = 1;
let allowScroll = true;

const allFilterFields = () => {
  return [doctorFilterDate, patientNameFilter, dateFilter, timeFilter, filterOrder, filterPerPage];
}

allFilterFields().forEach(e => e.value = "");

const buildPath = function () {
  const dateValue = dateFilter.value;
  const patientName = patientNameFilter.value;
  const doctorName = doctorFilterDate.value;
  const timeValue = timeFilter.value;
  const orderBy = filterOrder.value;
  const perPage = filterPerPage.value;
  const status = document.querySelector(".selected-appt-section").dataset.appointmentStatus;

  let path = `/api/v1/appointments?status=${status}`

  if (!!dateValue) {
    path = path.concat(`&date=${dateValue}`)
  }
  if (!!patientName) {
    path = path.concat(`&patient_name=${patientName}`)
  }
  if (!!doctorName) {
    path = path.concat(`&doctor_name=${doctorName}`)
  }
  if (!!timeValue) {
    path = path.concat(`&timeslot=${timeValue}`)
  }
  if (!!orderBy) {
    path = path.concat(`&order_by=${orderBy}`)
  }
  if (!!perPage) {
    path = path.concat(`&per_page=${perPage}`)
  }

  return path;
}

const renderAppointmentInDom = async function(path, removePrevious=true) {
  try {
    showSpinner();
    // const path = "/api/v1/appointments"
    const response = await fetch(path, reqHeaders("GET"));
    const appts = await response.json();
    console.log(appts);
    if (response.ok) {
      if (removePrevious) { [...tbody.children].forEach(tr=> tr.remove()) };
      if (appts.length == 0) { 
        allowScroll = false
        // showSuccessInNotificationCard("No more records found", 2500)
      }
      console.log(appts.length);
      appts.forEach(appt => {
        const apptRow = appointmentRows({
          doctor: appt.doctor_name,
          patient: appt.patient_name,
          timeslot: appt.timeslot,
          date: appt.date,
          status: appt.status,
          id: appt.id,
        }, tbody);
      })
    } else {
      showErrorInNotificationCard("Something went wrong")
    }
    removeSpinner();
  } catch (error) {
    removeSpinner();
    defaultErrorMessage();
    console.log(error);
  }

};

renderAppointmentInDom("/api/v1/appointments");

apptTypes.forEach(type=> {
  type.addEventListener("click", function(event) {
    pageNo, allowScroll = 1, true;
    const selectedType = document.querySelector(`.${selectedClass}`);
      
    if (!!selectedType) {
      selectedType.classList.remove(selectedClass);
    };

    type.classList.add(selectedClass)
    const status = type.dataset.appointmentStatus;
    const path= `/api/v1/appointments?status=${status}`;
    renderAppointmentInDom(path);
  });
});

tableContainer.addEventListener("scroll", async function(event) {
  // console.log("inside scroll");
  const tableC = event.currentTarget;
  const containerHeight = tableC.scrollHeight;
  const clientHeight = tableC.clientHeight;
  const scrolledHeight = tableC.scrollTop + clientHeight;
  const isScrollable = containerHeight > clientHeight;
  
  if (!isScrollable) {
    console.log("Not scrollable");
    return;
  }
  if ((containerHeight * 0.98) <= scrolledHeight && allowScroll) {
    console.log("you touch the bottom");
    
    pageNo++
    tableC.scrollTop = containerHeight * 0.50;
    
    const selectedType = document.querySelector(`.${selectedClass}`);
    const status = selectedType.dataset.appointmentStatus;
    const path = buildPath().concat(`&page=${pageNo}`);

    await renderAppointmentInDom(path, false);
  }
});


filterBtn.addEventListener("click", async function(event) {
  pageNo = 1;
  allowScroll = true;

  if (allFilterFields().every(e=> !e.value)) {
    showErrorInNotificationCard("Fill atleast one field to use filters", 5000)
    return;
  }
  renderAppointmentInDom(buildPath());
});

resetFilterBtn.addEventListener("click", function(event) {
  pageNo = 1;
  allowScroll = true;
  
  allFilterFields().forEach(filter=> filter.value = "");

  const status = document.querySelector(".selected-appt-section").dataset.appointmentStatus;
  let path = `/api/v1/appointments?status=${status}`

  renderAppointmentInDom(path);
});


