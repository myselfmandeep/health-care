import { eventHandler } from "../../appointments/event_handlers";
import { roles } from "../../general/helper_methods";

export function appointmentRows(props={}, parentElement) {
  const patientNameCol = roles.isPatient() ? "" : `<td>${props.patient}</td>`
  const doctorNameCol = roles.isDoctor() ? "" : `<td>${props.doctor}</td>`
  const apptId = props.id;
  
  const row =  `<tr id="appt-row-id-${apptId}">
                  ${patientNameCol}
                  ${doctorNameCol}
                  <td>${props.timeslot}</td>
                  <td>${props.date}</td>
                  <td>${props.status}</td>
                  <td>
                    <button class="appt-detail-btn open-modal-btn" id="appt-${apptId}" data-appt-id="${apptId}">Detail</button>
                  </td>
                </tr>`
                    
                    // <button class="appt-detail-btn open-modal-btn" id="appt-${apptId}" data-appt-id="${apptId}">See Detail-${apptId}</button>
                // <td class="modal-btn">Action</td>
  parentElement.insertAdjacentHTML("beforeend", row);

  const newlyAddedRow = document.querySelector(`#appt-${apptId}`);
  newlyAddedRow.addEventListener("click", eventHandler.seeDetail)
}