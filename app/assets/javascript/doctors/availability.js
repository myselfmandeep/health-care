import { createConsumer } from "../channels/consumer";
import getToken from "../auth/get_token";
import { generateTimeSlots } from "./generateTimeSlots";
window.consumer  = createConsumer;

getToken();

class BookAnAppointment {

  static execute() {
    const appointment = new this();

    appointment.fetchSpecializations();
  };

  constructor() {
    this.token = localStorage.getItem('token');
    this.appointmentContainer = document.querySelector("#appointment-container");
    this.doctorsList = []
  }

  // ========== FETCH SPECIALIZATIONS ==========
  async fetchSpecializations() {
    const header          = this.headers();
    const request         = await fetch("/api/v1/specializations", header);
    const specializations = await request.json(); 

    this.selectForm      = document.querySelector("#select-specialization");
    specializations.forEach((specialization) => {
      const option = `<option value="${specialization.id}">${specialization.name}</option>`;
      this.selectForm.insertAdjacentHTML("beforeend", option);
    });

    this.selectForm.addEventListener("change", this.fetchDoctorForSpecializatin.bind(this));
  };

  // ========== FETCH DOCTORS ==========
  async fetchDoctorForSpecializatin() {
    this.doctorSelectList = document.querySelector("#select-doctor");

    const value         = this.selectForm.value;
    const url           = `/api/v1/doctor_profiles/?specialization_id=${value}`;
    const response      = await fetch(url);
    const doctorsList   = await response.json();
    const selectOptions = this.convertCollectionToArray(this.doctorSelectList.options);

    selectOptions.forEach((option) => { if (Boolean(option.value)) { option.remove() } });
    
    this.doctorsList = doctorsList;

    doctorsList.forEach(doctor => {
      const option = `<option value="${doctor.id}">${doctor.doctor}</option>`;
      this.doctorSelectList.insertAdjacentHTML("beforeend", option)
    });

    this.doctorSelectList.addEventListener("change", (event) => { this.createDoctorAppointmentSlots(event)})
  }

  // ========== CREATE APPOINTMENT SLOTS
  async createDoctorAppointmentSlots(event) {
    event.stopImmediatePropagation();
    
    this.docRecord = this.doctorsList.find(doc => doc.id == this.doctorSelectList.value);
    const slots  =  generateTimeSlots(this.docRecord.start_at, this.docRecord.end_at, (this.docRecord.slot_duration || 30));
    console.log(this.docRecord, slots);
    const doctorSchedule = document.querySelector("#doctor-schedule");
    const slotHTML = slots.map(function (time) {
      return `
        <div data-slot-time="${time}" class="col-3 m-1" style="background-color: grey">
          ${time}
        </div>`
    }).join("");

    console.log(slotHTML);
    const dashboard=  `
      <div id="doctor-schedule" style="width: 18rem;" class="card m-3">
        <div class="card-body">
          <h3>Doctor schedule</h3>
          <div class="row" id="timeslots">
            ${slotHTML}
          </div>
        </div>
      </div>
    `;

    if (!!doctorSchedule) { 
      doctorSchedule.remove() 
    };
    
    this.appointmentContainer.insertAdjacentHTML("beforeend", dashboard)

    if (!this.dateOfAppointment) {
      this.doctorSelectList.insertAdjacentHTML("afterend", `<label>select date</label><input type="date" id="date-of-appointment">`)
    } else {
      this.dateOfAppointment.value = "";
      return; // IMP: it will prevent from adding same event multiple times on single element
    };
    
    this.dateOfAppointment = document.querySelector("#date-of-appointment");
    // this.showAvailabilityStatus.bind(this);
    const selectDate = this.dateOfAppointment;
    selectDate.addEventListener("change", this.showAvailabilityStatus.bind(this))
  }

  // ========== SHOW THE AVAILABILITY OF STATUS ==========

  async showAvailabilityStatus() {
    this.date = event.target.value;
    
    const url = `/api/v1/doctor_profiles/check_availability?doctor_id=${this.docRecord.id}&date=${this.date}`;
    const availabilityReq = await fetch(url);
    const reservedSlots   = await availabilityReq.json();
    const timeSlots       = document.querySelector("#timeslots");

    console.log(reservedSlots, timeSlots);
    
    this.convertCollectionToArray(timeSlots.children).forEach((slot) => {
        const newSlot = slot.cloneNode(true);
        slot.replaceWith(newSlot);

        newSlot.removeAttribute("data-taken-slot");
        
        if (reservedSlots.includes(slot.dataset.slotTime)) {
            newSlot.style.backgroundColor = "red";
        } else {
            newSlot.style.backgroundColor = "green";
            console.log("event has been added");
            newSlot.addEventListener("click", this.makeAnAppointment.bind(this));
        };
    });
  };
  
  // ========== MAKE AN APPOINTMENT ==========
  
  async makeAnAppointment() {

    const slotElement = event.target;

    if (slotElement.dataset.takenSlot == "true") { return };

    const url         = "/api/v1/appointments"
    const reqBody     = {body: JSON.stringify({doctor_id: this.doctorSelectList.value, timeslot: slotElement.dataset.slotTime , date: this.date})}
    const response    = await fetch(url, {...this.headers("POST"), ...reqBody});
    const appointment = await response.json();

    if (response.ok) {
      slotElement.setAttribute("data-taken-slot", true);
      slotElement.style.backgroundColor = "red";
      alert("You will be notified after doctor confirm your appointment");
    } else {
      const errors = [...new Set(appointment.errors)]
      alert(`error: ${errors[0]}`);
    };

    console.log(appointment);
  };

  // ========== HELPERS ==========

  headers(verb="GET") {
    return {
      method: verb,
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${this.getToken()}` }
    };
  };

  getToken() {
    const token = localStorage.token;

    return !token ? getToken() : localStorage.token;
  };

  convertCollectionToArray(collection) {
    return Array.from(collection);
  };
  
}

const bookingAppointment = BookAnAppointment.execute();
// console.log(BookAnAppointment);
