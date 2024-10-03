import { chatSeeker, closeModal, closeModal1, defaultErrorMessage, get_user_id, getBody, reqHeaders, showErrorInNotificationCard, showSuccessInNotificationCard } from "../general/helper_methods";
import { removeSpinner, showSpinner } from "../general/spinner";

const appts = [...document.querySelectorAll(".appt")];
const votes = document.querySelector(".votes");
const likes = votes.querySelector(".likes");
const likeIcon = likes.querySelector("i");
const dislikes = votes.querySelector(".dislikes");
const dislikeIcon = dislikes.querySelector("i");
const likeCount = likes.querySelector(".like-count");
const disLikeCount = dislikes.querySelector(".dislike-count");
console.log([votes, likes, dislikes]);

const VOTE = {
  onLike: () => {
    likeIcon.classList.remove("fa-regular");
    likeIcon.classList.add("fa-solid");
    
    dislikeIcon.classList.remove("fa-solid");
    dislikeIcon.classList.add("fa-regular");
  }, 

  onDislike: () => {
    likeIcon.classList.remove("fa-solid");
    likeIcon.classList.add("fa-regular");
    
    dislikeIcon.classList.remove("fa-regular");
    dislikeIcon.classList.add("fa-solid");
  },
  
  noVote: () => {
    likeIcon.classList.remove("fa-solid");
    likeIcon.classList.add("fa-regular");
    
    dislikeIcon.classList.remove("fa-solid");
    dislikeIcon.classList.add("fa-regular");
  }
}

const DASHBOARD = {
  apptModal: (apptId) => {
    return document.querySelector(`#appt-modal-${apptId}`);
  }
}

const fulfillAppt = async function(event) {
  try {
    const sure = confirm("Sure to mark fullfill this appointment?")
    if (sure) {
      showSpinner();
      const apptToFill = event.target;
      const dataSet = apptToFill.dataset;
      const apptId = dataSet.fulfilledBtn;
      const modal = DASHBOARD.apptModal(apptId);
      const timeslot = document.querySelector(`[data-appt-id="${apptId}"]`);
  
      const path = `/api/v1/appointments/${apptId}/change_status?status=fulfilled`
      const response = await fetch(path, reqHeaders("PUT"));
      const appointment = await response.json()
  
      if (response.ok) {
        console.log(appointment);
        [modal, timeslot].forEach(e=>e.remove())
        showSuccessInNotificationCard(`You have marked appointment fulfilled with ${appointment.patient_name} successfully`, 3500)
      } else {
        showErrorInNotificationCard(appointment)
      }
    } else {
      return
    }
  } catch (error) {
    defaultErrorMessage(error);
  } finally {
    removeSpinner();
  }
};

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
                        <button class="app-action-btn" data-fulfilled-btn="${apptId}">Fulfilled</button>
                      </div>
                    </div>
                  </div>`
  
  parentElement.insertAdjacentHTML("afterbegin", modal)
  const btn = document.querySelector(`[data-doctor-id="${props.patient_id}"]`)
  const fulfilled = document.querySelector(`[data-fulfilled-btn="${apptId}"]`);
  btn.addEventListener("click", chatSeeker);
  fulfilled.addEventListener("click", fulfillAppt)
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

likes.addEventListener("click", async (e) => {
  // const btn = e.target;
  const btn = e.currentTarget;
  const icon = btn.querySelector("i");
  const drId  = btn.dataset.id;
  const likeOrUnlike = icon.classList.contains('fa-regular') ? "POST" : "DELETE"; 
  const isLiked = likeOrUnlike == "POST" ? true : "";
  const userId = get_user_id();

  if (!userId) {
    return showErrorInNotificationCard("Login required to perform this action");
  }
  
  try {
    const path = `/api/v1/doctor_profiles/${drId}/votes/upvote?user_id=${get_user_id()}&reaction=like`;
    const response = await fetch(path, reqHeaders("POST"));
    const getVote = await response.json();

    console.log(getVote, response.ok);

    if (response.ok) {
      const votes = getVote.votes;
      const castedVote = votes.vote_casted;

      if (castedVote == "like") {
        VOTE.onLike()
      } else if(castedVote == "dislike") {
        VOTE.onDislike()
      } else {
        VOTE.noVote();
      }

      likeCount.textContent = votes.likes;
      disLikeCount.textContent = votes.dislikes;
    } else {
      showErrorInNotificationCard(getVote);
    }
    
  } catch (error) {
    defaultErrorMessage(error)
  }
  
  console.log(icon, drId);
  // console.log(btn);
})

dislikes.addEventListener("click", async (e) => {
  // const btn = e.target;
  const btn = e.currentTarget;
  const icon = btn.querySelector("i");
  const drId  = btn.dataset.id;
  const likeOrUnlike = icon.classList.contains('fa-regular') ? "POST" : "DELETE"; 
  const isLiked = likeOrUnlike == "DELETE" ? false : "";
  const userId = get_user_id();

  if (!userId) {
    return showErrorInNotificationCard("Login required to perform this action");
  }
  
  try {
    const path = `/api/v1/doctor_profiles/${drId}/votes/downvote?user_id=${get_user_id()}&reaction=dislike`;
    const response = await fetch(path, reqHeaders("POST"));
    const getVote = await response.json();

    console.log(getVote, response.ok);

    if (response.ok) {
      const votes = getVote.votes;
      const castedVote = votes.vote_casted;

      if (castedVote == "like") {
        VOTE.onLike()
      } else if(castedVote == "dislike") {
        VOTE.onDislike()
      } else {
        VOTE.noVote();
      }

      likeCount.textContent = votes.likes;
      disLikeCount.textContent = votes.dislikes;
    } else {
      showErrorInNotificationCard(getVote);
    }
    
  } catch (error) {
    defaultErrorMessage(error)
  }
  
  console.log(icon, drId);
  // console.log(btn);
})