import { defaultErrorMessage, showErrorInNotificationCard } from "../general/helper_methods";
import { removeSpinner, showSpinner } from "../general/spinner";

const specs = [...document.querySelectorAll(".spec")];
const doctorsTable = document.querySelector(".doctor-table");
const tbody = doctorsTable.querySelector("tbody")

specs.forEach(function(spec) {
  spec.addEventListener("click", async function(event) {
    const spec = event.currentTarget
    const selectedSpec = specs.find(spec => spec.classList.contains("selected"));
    if (!!selectedSpec) {
      selectedSpec.classList.remove("selected");
    };
    if (spec.classList.contains("selected")) {
      spec.classList.remove("selected")
    } else {
      spec.classList.add("selected")
    };
    
    const hospitalId = event.currentTarget.dataset.hospitalId;
    let specId = specs.find(spec=> spec.classList.contains("selected"));
    const data = specId.dataset;
    specId = data.specializationId;
    const hasNoDoctor = data.hasDoctor == "false"

    if (hasNoDoctor) {
      showErrorInNotificationCard("No doctor available!", 5000);
      return;
    }
    try {
      showSpinner();
      const path = `/api/v1/hospitals/${hospitalId}/get_doctors?specialization_id=${specId}`;
      const response = await fetch(path);
      const doctors = await response.json();
      console.log(doctors);
      if (response.ok) {
        if (doctors.length > 0) {
          [...tbody.children].forEach(row=> row.remove());
          const docRows = doctors.map(doctor => `
            <tr>
            <td>${doctor.doctor}</td>
            <td>${doctor.highest_qualification}</td>
            <td>${doctor.experience_time}</td>
            <td>${doctor.start_at}</td>
            <td>${doctor.end_at}</td>
            <td>${doctor.slot_duration} min</td>
            <td>
            <a class="a-2-btn" href="/doctors/${doctor.id}/book_appointment/">Checkout</a>
            </td>
            </tr>`
          ).join("\n");
          tbody.insertAdjacentHTML("afterbegin", docRows);
        } else {
          console.log("no doctor found");
          showErrorInNotificationCard("No doctor found!", 5000);
        }
      } else {
        showErrorInNotificationCard(doctors);
      };
    } catch (error) {
      defaultErrorMessage(error);
      console.error(error);
    } finally {
      removeSpinner();
    };
  });
    
});