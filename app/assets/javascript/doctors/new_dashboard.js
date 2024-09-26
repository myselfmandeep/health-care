import { chatSeeker, closeModal, closeModal1, defaultErrorMessage, getBody, showErrorInNotificationCard } from "../general/helper_methods";
import { removeSpinner, showSpinner } from "../general/spinner";

const appts = [...document.querySelectorAll(".appt")];

const DASHBOARD = {
  apptModal: (apptId) => {
    return document.querySelector(`#appt-modal-${apptId}`);
  }
}

const apptModal = function(props={}, parentElement=null) {
  const NA = "Not Available";
  const patientName = props.patient_name || NA;
  const apptId = props.id;
  const stymptoms = props.symptoms || NA;
  const medicalHistory = props.medical_history || NA;
  
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
                        <div class="detail">
                          <h4>Patient:</h4>
                          <p>${patientName}</p>
                        </div>
                        <div class="detail">
                          <h5>Symptoms</h5>
                          <p>${stymptoms}</p>
                        </div>
                        <div class="detail">
                          <h5>Medical History</h5>
                          <p>${medicalHistory}</p>
                        </div>
                      </div>
                      <div class="appt-actions">
                        <button class="app-action-btn cancel-appt-btn" data-doctor-id="${props.patient_id}" data-doctor-name="${patientName}">Chat</button>
                      </div>
                    </div>
                  </div>`
  
  parentElement.insertAdjacentHTML("afterbegin", modal)
  const btn = document.querySelector(`[data-doctor-id="${props.patient_id}"]`)
  btn.addEventListener("click", chatSeeker);
}

appts.forEach(appt => {
  appt.addEventListener("click", async function(event) {
    const currentElement = event.currentTarget;
    const id = currentElement.dataset.apptId;
    const cModal = document.querySelector(`#appt-modal-${id}`);
    
    if (!!cModal) { 
      console.log("hello present");
      cModal.style.display = "" 
      closeModal1(cModal)
      return;
    };
    
    try {
      showSpinner();
      const response = await fetch(`/api/v1/appointments/${id}`);
      const appt = await response.json();
      
      if (response.ok) {
        const body = document.querySelector("body");
        apptModal(appt, getBody())
        
        closeModal();
      } else {
        showErrorInNotificationCard(appt);
      }
    } catch (error) {
      defaultErrorMessage(error);
    } finally {
      removeSpinner();
    }
  })
})