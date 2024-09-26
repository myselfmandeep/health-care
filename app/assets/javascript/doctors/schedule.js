import getToken from "../auth/get_token";
import {generateTimeSlots} from "./generateTimeSlots"

getToken();

class DoctorPortfolio {
  static execute() {
    const portfolio = new this();

    portfolio.addEventToListScheduleBtn();
  };

  constructor() {
    this.doctorScheduleSlots   = document.querySelector("#doctor-schedule-slots");
    this.startAt               = document.querySelector("#start-at").textContent;
    this.endAt                 = document.querySelector("#end-at").textContent;
    this.slotTime              = document.querySelector("#slot-duration").textContent;
    this.slots                 = generateTimeSlots(this.startAt, this.endAt, Number(this.slotTime));
    this.doctorScheduleBtn     = document.querySelector("#doctor-schedule");
    this.seeAppointments       = document.querySelector("#see-appointments");
    this.confirmedAppointments = document.querySelector("#confirmed-appointments");
  };

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

    // ========== TIME SLOTS ==========

  listScheduleOfDoctor() {
    if (this.doctorScheduleSlots.children.length > 0) { return }

    this.doctorScheduleSlots.insertAdjacentHTML("beforeend", this.slotHtml());
  };
  
  addEventToListScheduleBtn() {
    this.doctorScheduleBtn.addEventListener("click", this.listScheduleOfDoctor.bind(this));
    this.seeAppointments.addEventListener("click", this.addDataToTable.bind(this));
    // this.confirmedAppointments.addEventListener("click", this.listConfirmedAppointments.bind(this));
  };

  slotHtml() {
    const html =  this.slots.map(function(slot) {
                    return `<div class="col-3">
                              <h4>
                                <span class="badge bg-secondary">
                                  ${slot}
                                </span>
                            </h4>
                          </div>`
    });

    return html.join("");
  };

  // ========== TABLE DATA ==========
  
  async addDataToTable() {
    this.tableBody = document.querySelector("#doctor-appointments-table-body");

    if (this.tableBody.childElementCount > 0) { return };
    
    const url          = "/api/v1/appointments"
    const response     = await fetch(url, this.headers());
    const appointments = await response.json();
    
    console.log(appointments);

    
    this.tableBody.insertAdjacentHTML("afterbegin", this.tableBodyRows(appointments));

    this.changeStatus();
  };

  tableBodyRows(data) {
    return data.map((appointment, index) => {
      const status = appointment.status;
      // const setVisibility = `style="display:${(status == "rejected" || status == "confirmed") ? "none" : ""};"`;
      const setVisibility = `style="display:${(status == "rejected" || status == "confirmed") ? "" : ""};"`;
      return `
            <tr ${setVisibility}>
              <th scope="row">${index+1}</th>
              <td>${appointment.patient_name}</td>
              <td>${appointment.timeslot}</td>
              <td>${appointment.date}</td>
              <td class="status" id="status-${appointment.id}">${appointment.status}</td>
              <td>
                <button class="btn btn-success approve-appointment" 
                        data-appointment-id="${appointment.id}" 
                        data-confirm="true"
                        ${setVisibility}>
                        Approve
                </button>
              </td>
              <td>
                <button class="btn btn-danger reject-appointment" 
                        data-appointment-id="${appointment.id}" 
                        data-confirm="false"
                        ${setVisibility}>
                        Reject
                </button>
              </td>
            </tr>`
    }).join("");
  };

  // =========== REJECT & APPROVE =========

  changeStatus() {
    this.approveButtons = document.querySelectorAll(".approve-appointment");  
    this.rejectButtons  = document.querySelectorAll(".reject-appointment");

    this.approveButtons.forEach((element) => {
      element.addEventListener("click", this.changeStatusToReject.bind(this))
    });

    this.rejectButtons.forEach((element) => {
      element.addEventListener("click", this.changeStatusToReject.bind(this))
    });
    
    // this.changeStatusToReject();
  };

  async changeStatusToReject() {
    const appointmentId = event.target.dataset.appointmentId;
    const url           = `/api/v1/appointments/${appointmentId}/change_status`;
    const body          = {body: JSON.stringify({status: (event.target.dataset.confirm == "true" ? "confirmed" : "rejected")})};
    const options       = {...body, ...this.headers("PUT")};
    const response      = await fetch(url, options);
    const appointment   = await response.json();
    
    if (response.ok) {
      const tdStatus     = document.querySelector(`#status-${appointmentId}`);
      const selectReject = document.querySelectorAll(`[data-appointment-id=\"${appointment.id}\"]`)

      selectReject.forEach(element => {
        element.style.display = "none";
      }) 
      
      tdStatus.innerHTML = appointment.status;
    };

    console.log(appointmentId, appointment);
  };

  // ========== FILTERS ==========

  listConfirmedAppointments() {
    console.log("helo world");
    [...this.tableBody.children].forEach(element => {
      const status = element.querySelector(".status").textContent

      console.log(status);

      element.style.display = (status=="confirmed") ? "" : "none";
    })
  }
  
};

DoctorPortfolio.execute();
