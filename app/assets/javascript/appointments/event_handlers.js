import { seeDetailModal } from "../components/appointments/see_detail_modal";
import { closeModal, closeModal1, defaultErrorMessage, reqHeaders, roles, showErrorInNotificationCard, showSuccessInNotificationCard } from "../general/helper_methods";
import {showSpinner, removeSpinner } from "../general/spinner";

export const eventHandler = {
  seeDetail: async function(event) {
    const currentElement = event.currentTarget;
    const id = currentElement.dataset.apptId;

    const apptModal = document.querySelector(`#appt-modal-${id}`);
    
    if (!!apptModal) { 
      console.log("hello present");
      apptModal.style.display = "" 
      closeModal1(apptModal)
      return;
    };
    
    try {
      const response = await fetch(`/api/v1/appointments/${id}`);
      const appt = await response.json();
      
      if (response.ok) {
        const body = document.querySelector("body");
        const modal = seeDetailModal({
          id: appt.id,
          doctor: appt.doctor_name,
          patient: appt.patient_name,
          medicalHistory: appt.medical_history,
          symptoms: appt.symptoms,
          status: appt.status,
          cancellationReason: appt.cancellation_reason,
          apptCode: appt.code,
          hasFeedback: appt.has_feedback
        }, body);
        
        closeModal();
      } else {
        showErrorInNotificationCard(response)
      }
    } catch (error) {
      console.log(error);
      defaultErrorMessage();
    }
  },

  changeStatusOfAppt: async function(event) {
    // debugger;
    const dataSet = event.currentTarget.dataset;
    const actionType = dataSet.apptActionType;
    try {
      showSpinner();
      let path     = `/api/v1/appointments/${dataSet.toolipApptId}/change_status?status=${actionType}`
      
      if (actionType == "cancelled") {
        const reason = dataSet.apptCancellationReason;
        if (!reason) {
          defaultErrorMessage();
          return;
        }
        path = path.concat(`&cancellation_reason=${reason}&cancelled_at=${new Date()}&cancelled_by=${localStorage.role}`);
      };
      
      const response = await fetch(path, reqHeaders("PUT"))
      const appointment = await response.json();
      console.log(appointment);
      if (response.ok) {
        const toolip = document.querySelector(`#confirmation-toolip-${dataSet.toolipApptId}`);
        const modal = document.querySelector(`#appt-modal-${appointment.id}`);
        const row = document.querySelector(`#appt-row-id-${appointment.id}`)

        row.remove();
        toolip.remove()
        modal.remove()

        const status = appointment.status;
        const dr = `Dr ${appointment.doctor_name}`
        const patient = `patient ${appointment.patient_name}`
        const successAlert = `you have successfully ${status} appointment with ${roles.isPatient() ? dr :  patient}` 

        showSuccessInNotificationCard(successAlert, 5000);
      } else {
        showErrorInNotificationCard(appointment)
      };
      
      removeSpinner();
    } catch (error) {
      removeSpinner();
      console.log(error);
      defaultErrorMessage();
    }
  }
}