import { defaultErrorMessage, reqHeaders, showApiErrorResponse, showApiResponse, showErrorInNotificationCard, showSuccessInNotificationCard, roles } from "../general/helper_methods";
import { removeSpinner, showSpinner } from "../general/spinner";
import { generateTimeSlots } from "./generateTimeSlots";

function validatePreviousDate(date, timeSlot) {
  const hourMin = timeSlot.split(":");
  const timeNow = new Date();
  const bookingDate = new Date(date);
  bookingDate.setHours(hourMin[0]);
  bookingDate.setMinutes(hourMin[1]);
  const unixTimeNow = timeNow.getTime();
  const unixbookingDate = bookingDate.getTime();
  // console.log([hourMin], ["time Now", timeNow], ["bookingDate", bookingDate], [unixTimeNow < unixbookingDate]);
  return  unixTimeNow > unixbookingDate;
};

const dateToday = () => new Date();
const isPreviousDate = (date) => {
  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
  return today.getTime() > inputDate.getTime();
};

async function bookSlot() {
  const bookBtns = document.querySelectorAll(".book-now");
  const token    = localStorage.getItem("token");

  bookBtns.forEach(function(bookBtn) {
    bookBtn.addEventListener("click", async function() {
      if (this.classList.contains("disabled-cursor")) {
        return;
      }
      if (!token) {
        const wantToLogin = confirm("Log in required for appointment booking. Do you want to login now")
        if (wantToLogin) {
          location.href = "/auth/login";
        }
        return
      };
      const dataset = this.dataset
      if (dataset.taken == "true") { return };
      const symptoms = document.querySelector("#medical-symptoms");
      const medicalHistory = document.querySelector("#medical-history");
      const [doctorId, timeslot, date] = [dataset.doctorId, dataset.time, dataset.date];
      const are_you_sure = confirm(`are you sure you want to make request for appointment of ${timeslot} timeslot for ${date}`)
      if (are_you_sure) {
        const values = {doctor_id: doctorId, timeslot: timeslot, date: date, symptoms: symptoms.value, medical_history: medicalHistory.value}
        const params = new URLSearchParams(values).toString();
        const path = `/api/v1/appointments?${params}`
        const response = await fetch(path, reqHeaders("POST"))
        try {
          const appointment = await response.json();
          if (response.ok) {
            this.setAttribute("data-taken", true);
            // this.parentElement.style.backgroundColor = "red";
            // this.parentElement.style.backgroundColor = "red";
            this.style.backgroundColor = "#c7c7c7";
            // this.style.color = "white";

            // this.parentElement.style.backgroundColor = "red";
            // this.style.cursor = "not-allowed"
            // this.textContent = "N/A";
            this.classList.add("disabled-cursor");
            // this.textContent = "Booked";

            symptoms.value = ""
            medicalHistory.value = ""

            const message = "you have successfully made request for an appointment. You will be notified once doctor confirm your appointment";
            // showApiResponse(message, 8000)
            showSuccessInNotificationCard(message, 8000)
          } else {
            // showApiErrorResponse(appointment, 5000)
            showErrorInNotificationCard(appointment, 7000)
          };
          console.log(appointment);
        } catch (error) {
          // showApiResponse("Something went wrong. Please try again later.");
          defaultErrorMessage();
          console.error(error);
        };
      } else {
        console.log("not sure");
      };
    });
  });
};

const appointmentDate = document.querySelector("#appointment-date");
const minDate = dateToday();
appointmentDate.setAttribute("min", appointmentDate.value);

async function bookAppointmentSlots() {
  const timeSlots = document.querySelector(".timeslots");

  if (timeSlots.childElementCount > 0) {
    [...timeSlots.children].forEach((child) => child.remove());
  };
  
  const doctor = timeSlots.dataset
  const startAt = doctor.startAt
  const endAt = doctor.endAt
  const slotDuration = Number(doctor.slotDuration)
  const doctorId = doctor.doctorId
  const slots = generateTimeSlots(startAt, endAt, slotDuration);
  const errors = {}
  let date = appointmentDate.value 

  if (date == "") {
    errors.reqDate = "Date must be present!";
  } else if (isPreviousDate(date)) {
    errors.previousDate = "You can't make request for previous dates"
  };
  
  if (Object.keys(errors).length > 0) {
    showErrorInNotificationCard(errors);
    return;
  }
  
  try {
    showSpinner();
    const path = `/api/v1/doctor_profiles/check_availability?doctor_id=${doctorId}&date=${date}`
    const response = await fetch(path)
    const reservedSlots = await response.json();
    const showBookBtn = roles.isPatient() || roles.isGuest();
    
    if (response.ok) {
      const slotsHTML = slots.map(function(time) {
        const isExpired = validatePreviousDate(date, time) 
        validatePreviousDate(date, time)
        console.log(reservedSlots);
        // debugger;
        const taken = reservedSlots.includes(time) || validatePreviousDate(date, time)

        let buttonText = "";

        if (validatePreviousDate(date, time)) {
          buttonText = "Expired";
        } else if (reservedSlots.includes(time)) {
          buttonText = "Booked";
        } else {
          buttonText = "Book Now"
        };
        
        const greenOrRed  = (taken )  ? "#c7c7c7" : "white";
        const cursor = (taken || roles.isDoctor() || roles.isSuperAdmin()) ? "disabled-cursor": "";
        // const button = `
        //     <button 
        //       class="book-now ${cursor}" 
        //       data-time="${time}" 
        //       data-doctor-id="${doctorId}" 
        //       data-date="${date}"
        //       data-taken="${taken ? true : false}">
        //       ${buttonText}
        //     </button>
        // `;
        const button = "";
        return `
          <div 
            class="each-slot book-now ${cursor}" 
            data-allow-click="${!isExpired}" 
            style="background-color:${greenOrRed}"
            data-time="${time}" 
            data-doctor-id="${doctorId}" 
            data-date="${date}"
            data-taken="${taken ? true : false}">
            <span class="time">
              ${time}
            </span>
          </div>`
      }).join("");
      // ${ taken ? "Booked" : "Book Now" }
      
      timeSlots.insertAdjacentHTML("afterbegin", slotsHTML)
      const bookBtns = document.querySelectorAll(".book-now");
  
      bookSlot();
    } else {
      showApiErrorResponse(reservedSlots)
    };
  } catch (error) {
    // showApiErrorResponse("Something went wrong please try again later")
    showErrorInNotificationCard("Something went wrong please try again later")
    console.log(error);
  } finally {
    removeSpinner()
  }
};

bookAppointmentSlots();
appointmentDate.addEventListener("change", bookAppointmentSlots);