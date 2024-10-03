import { cancelBtn } from "./cancel_button";
import { confirmBtn } from "./confirm_button";
import { rejectBtn } from "./reject_button";
import { confirmationToolip } from "./confirmation_toolip";
import { defaultErrorMessage, roles, showErrorInNotificationCard } from "../../general/helper_methods";
import { feedbackBtn } from "./feedback_btn";

export function removeAnyExistingToolip() {
  const toolip = document.querySelector(".confirmation-toolip");
  !!toolip ? toolip.remove() : "";
}

export function removeOrAddClass(element) {
  const selectedActionClass = "selected-appt-action";
  const existingSelectedAction = document.querySelector(".selected-appt-action");

  if (!!existingSelectedAction) {
    existingSelectedAction.classList.remove(selectedActionClass);
  };
  
  element.classList.add(selectedActionClass);
}

export function seeDetailModal(props={}, parentElement) {
  const nA = "Not Available"
  const symptoms = props.symptoms || nA;
  const medicalHistory = props.medicalHistory || nA;
  const apptId = props.id;
  const status = props.status;
  const code = props.apptCode;
  const hasFeedback= props.hasFeedback;

  let cancellationReason = props.cancellationReason;

  const isCancelled = status === "cancelled";
  const isRejected = status === "rejected";
  const isConfirmed = status === "confirmed";
  const isRequested = status === "requested";
  const isFulfilled = status === "fulfilled";
  // const isSuperAdminOrDoctor = roles.isDoctor() || roles.isSuperAdmin()
  const isSuperAdminOrDoctor = roles.isDoctor()
  
  let appointmentConfirmationBtn = "";
  let appointmentRejectionBtn = "";
  let appointmentCancellationBtn = "";
  let leaveFeebackBtn = "";

  if (!isCancelled && isRequested && isSuperAdminOrDoctor) {
    appointmentConfirmationBtn = `${confirmBtn({
      id: apptId
    })}`;
  };
  if (!isCancelled && isRequested && isSuperAdminOrDoctor) {
    appointmentRejectionBtn = `${rejectBtn({
      id: apptId
    })}`
  };
  // if (!isCancelled && (isConfirmed)  || (isRequested)) && !roles.isSuperAdmin()) {
  if ((!isCancelled && isConfirmed)  || (isRequested && roles.isPatient()) && !roles.isSuperAdmin()) {
    appointmentConfirmationBtn = `${cancelBtn({
      id: apptId
    })}`
  };

  if (isFulfilled && !hasFeedback && roles.isPatient()) {
    leaveFeebackBtn = feedbackBtn({
      apptCode: code
    });
  };
  if (isCancelled) {
    cancellationReason = `<div class="detail">
                            <h4>Reason of Cancellation:</h4>
                            <p>${cancellationReason || nA}</p>
                          </div>`
  };
  const doctorDetail = `<div class="detail">
                          <h4>Doctor:</h4>
                          <p>${props.doctor}</p>
                        </div>`

  const patientDetail = `<div class="detail">
                          <h4>Patient:</h4>
                          <p>${props.patient}</p>
                        </div>`

  const modal =  `<div class="modal-container" id="appt-modal-${apptId}">
                    <div class="main-modal">
                      <div class="modal-header">
                        <div class="heading">
                          <h5>Appointment Detail</h5>
                        </div>
                        <div class="close-btn">
                          <p>Close</p>
                        </div>
                      </div>
                      <div class="modal-body">
                        ${roles.isPatient() || roles.isSuperAdmin() ? doctorDetail : ""}
                        ${roles.isDoctor() || roles.isSuperAdmin() ? patientDetail : ""}
                        <div class="detail">
                          <h5>Symptoms</h5>
                          <p>${symptoms}</p>
                        </div>
                        <div class="detail">
                          <h5>Medical History</h5>
                          <p>${medicalHistory}</p>
                        </div>
                        ${cancellationReason || ""}
                      </div>
                      <textarea class="reason-field hidden" placeholder="reason of cancellation"></textarea>
                      <div class="appt-actions">
                        ${appointmentConfirmationBtn}
                        ${appointmentRejectionBtn}
                        ${appointmentCancellationBtn}
                        ${leaveFeebackBtn}
                      </div>
                    </div>
                  </div>`;

  parentElement.insertAdjacentHTML("afterbegin", modal);
  
  const confirmActionBtn = document.querySelector(`[data-appt-confirm-id="${apptId}"]`);
  const rejectActionBtn = document.querySelector(`[data-appt-reject-id="${apptId}"]`);
  const cancelActionBtn = document.querySelector(`[data-appt-cancel-id="${apptId}"]`);
  const reasonField = document.querySelector(".reason-field");
  const feedback = document.querySelector(`[data-appt-code="${code}"]`);
  
  if(!!cancelActionBtn) {
    cancelActionBtn.addEventListener("click", function(event) {
      removeAnyExistingToolip()
      removeOrAddClass(event.currentTarget)
      const value = reasonField.value
      
      if (reasonField.classList.contains("hidden")) {
        reasonField.classList.remove("hidden");
      } else if (!value && value < 10) {
        showErrorInNotificationCard("Cancellation reason must be specified");
      } else if(value.length < 10) {
        showErrorInNotificationCard("Cancellation reason must have lenght of 10 characters")
      } else if(value.length > 4000) {
        showErrorInNotificationCard(`Cancellation reason should have maximum length of 4000 characters. Meanwhile you have provided reason with length ${value.length}`)
      } else {
        confirmationToolip({
          id: apptId,
          actionType: "cancelled",
          reason: value
        }, event.currentTarget)
      }
    });
  }
  
  if (!!confirmActionBtn) {
    confirmActionBtn.addEventListener("click", function(event) {
      removeOrAddClass(event.currentTarget)
      removeAnyExistingToolip()
      reasonField.classList.add("hidden");
      confirmationToolip({
        id: apptId,
        actionType: "confirmed"
      }, event.currentTarget)
    });
  };

  if (!!rejectActionBtn) {
    rejectActionBtn.addEventListener("click", function(event) {
      removeOrAddClass(event.currentTarget)
      removeAnyExistingToolip()
      reasonField.classList.add("hidden");
      confirmationToolip({
        id: apptId,
        actionType: "rejected"
      }, event.currentTarget)
    });
  };

  if (!!feedback) {
    feedback.addEventListener("click", function(event) {
      const uniqApptCode = event.target.dataset.apptCode;

      if (!uniqApptCode) {
        defaultErrorMessage();
      } else {
        location.href = `appointments/${uniqApptCode}/feedback`;
      };
    });
  }

}
