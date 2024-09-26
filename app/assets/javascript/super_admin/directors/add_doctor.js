import { defaultErrorMessage, reqHeaders, showApiErrorResponse, showApiResponse, showErrorInNotificationCard, showSuccessInNotificationCard } from "../../general/helper_methods";
import { removeSpinner, showSpinner } from "../../general/spinner";

console.log("add new doctor");

const createDoctorForm = document.querySelector("#create-doctor-form");

const email = document.querySelector("#email");
const fullName = document.querySelector("#name");
const password = document.querySelector("#password");
const passwordConfirmation = document.querySelector("#password_confirmation");
const dateOfBirth = document.querySelector("#date-of-birth");
const gender = document.querySelector("#gender");
const startAt = document.querySelector("#start-at");
const endAt = document.querySelector("#end-at");
const qualification = document.querySelector("#highest-qualification");
const experience = document.querySelector("#experience");
const slotDuration = document.querySelector("#slot-duration");
const hospital = document.querySelector("#hospital");
const department = document.querySelector("#departments");
const submitBtn = document.querySelector("#form-submit-button");
const errorContainer = document.querySelector("#error_explanation")

const drValidations = () => {
  const errors = [];

  // if (!/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
  //   errors.push("Invalid Email")
  // }
  if (!(fullName.value.length > 2 && fullName.value.length < 25)) {
    errors.push("Name length should be minimum of 3 and maximum 25");
  }
  if (password.value != passwordConfirmation.value) {
    errors.push("Password confirmation didn't match")
  }
  if (qualification.value.length < 2) {
    errors.push("Please provide a valid qualification")
  } 
  if (!(Number(experience.value) > 0)) {
    errors.push("Please provide a valid experience years")
  }
  
  return errors;
}

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const fetchDepartments = async function(event) {
  const currentElement = event.currentTarget;
  const value = currentElement.value
  
  if (value == "") { return };
  try {
    const path = `/api/v1/departments?hospital_id=${value}`
    const response = await fetch(path) 
    const departments = await response.json();
    console.log(departments);
    if (response.ok) {
      [...department.options].forEach(option => {
        if (option.value != "") {
          option.remove();
        }
      });
      const createOptions = departments.forEach(dep => {
        department.insertAdjacentHTML("beforeend", `<option value="${dep.id}">${dep.dep_name}</option>`);
      });
    } else {
      showErrorInNotificationCard(departments, 7000);
    };
  } catch (error) {
    console.log(error);
    showApiResponse("Something went wrong please try again later");
  };
};

hospital.addEventListener("change", fetchDepartments);
submitBtn.addEventListener("click", async function(event) {
  event.preventDefault();
  showErrorInNotificationCard(drValidations(), 10000);
  const inputFields = [email, fullName, password, passwordConfirmation, dateOfBirth, gender, startAt, endAt, qualification, experience, slotDuration, hospital, department];
  const isValid = inputFields.every(e=> {
    return !e.value == false;
  });
  if (isValid) {
    [...errorContainer.children].forEach(e=> e.remove());
    const path = "/api/v1/doctors/add_new_doctor";
    const params = `email=${email.value}&full_name=${fullName.value}&role=doctor&password=${password.value}&password_confirmation=${passwordConfirmation.value}&gender=${gender.value}&date_of_birth=${dateOfBirth.value}&doctor_profile[department_id]=${department.value}&doctor_profile[start_at]=${startAt.value}&doctor_profile[end_at]=${endAt.value}&doctor_profile[slot_duration]=${slotDuration.value}&doctor_profile[years_of_experience]=${experience.value}&doctor_profile[highest_qualification]=${qualification.value}`;
    try {
      showSpinner();
      const response = await fetch(`${path}?${params}`, reqHeaders("POST"))
      const dr = await response.json();
      if (response.ok) {
        showSuccessInNotificationCard("Successfully added doctors. You are redirecting to Doctors page", 6000)       
        setTimeout(() => window.location.href = "/doctors", 6000)
      } else {
        showErrorInNotificationCard(dr, 7000)
      };
    } catch(error) {
      defaultErrorMessage(error)
    } finally {
      removeSpinner();
    };
  } else {
    if (!(errorContainer.childElementCount > 0)) {
      // errorContainer.insertAdjacentHTML("afterbegin", "<p>Please fill all the field</p>")
      // showErrorInNotificationCard("Please fill all the field",5000);
    };
  };
})