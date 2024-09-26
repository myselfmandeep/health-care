import { assignBgToBody, defaultErrorMessage, reqHeaders, showApiErrorResponse, showApiResponse, showErrorInNotificationCard, showSuccessInNotificationCard } from "../../../general/helper_methods";

assignBgToBody("#838383");
  
const selectSource = document.querySelector(".select-source");
const selectConsumer = document.querySelector(".select-consumer");
const sourceSpecializations = [...selectSource.querySelectorAll(".specialization")];
const addSpecBtn = document.querySelector("#add-specialization");
const removeSpecBtn = document.querySelector("#remove-specialization");
const selectClass = "selected-specialization";
const hospitalSubmitBtn = document.querySelector("#new-hospital-submit");
const hospitalName = document.querySelector("#hospital-name");

console.log(sourceSpecializations);

sourceSpecializations.forEach(spec => {
  const dataset = spec.dataset;
  const specializationId = dataset.specializationId;

  spec.addEventListener("click", (event) => {
    spec.classList.contains(selectClass) ? spec.classList.remove(selectClass) : spec.classList.add(selectClass);
  });
});

addSpecBtn.addEventListener("click", function(event) {
  const selectedSpecializations = sourceSpecializations.filter(spec => spec.classList.contains(selectClass));
  
  selectedSpecializations.forEach(spec => {
    if (spec.parentElement == selectSource) {
      spec.classList.remove(selectClass)
      selectConsumer.insertAdjacentElement("afterbegin", spec);
    }
  });
});

removeSpecBtn.addEventListener("click", function(event) {
  const consumeSpecs = [...selectConsumer.childNodes]
  const selectedSpecializations = consumeSpecs.filter(spec => spec.classList.contains(selectClass));
  
  selectedSpecializations.forEach(spec => {
    spec.classList.remove(selectClass)
    selectSource.insertAdjacentElement("afterbegin", spec);
  });
});

hospitalSubmitBtn.addEventListener("click", async function(event) {
  const specIDs = [...selectConsumer.childNodes].map(spec => spec.dataset.specializationId);
  const hosName = hospitalName.value;
  const errors  = []

  if(hosName.length < 8) {
    errors.push("Hospital name should have minimum length 8");
  } else if (hosName.length > 50) {
    errors.push("Hospital name should have maximum length 50");
  }
  if(specIDs.filter(e=> e).length < 1) {
    errors.push("Please select departments for the hospital")
  }
  if (errors.length > 0) {
    showErrorInNotificationCard(errors, 8000);
  } else {
    try {
      const reqbody = {body: JSON.stringify({departments: specIDs, name: hosName})}
      const path = "/api/v1/hospitals"
      const response = await fetch(path, {...reqHeaders("POST"), ...reqbody})
      const hospital = await response.json();
      console.log(hospital);
      if (response.ok) {
        showSuccessInNotificationCard("Successfully created new hospital. You are redirecting to hospital profile within 3 seconds", 10000)
        setTimeout(() => location.href = `/hospitals/${hospital.id}`, 3500);
      } else {
        // showApiErrorResponse(hospital, 8000)
        showErrorInNotificationCard(hospital, 15000)
      };
    } catch (error) {
      defaultErrorMessage();
      console.log(error);
    };
  };
});