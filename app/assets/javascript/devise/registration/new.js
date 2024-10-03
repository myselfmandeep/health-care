import { reqHeaders, showApiErrorResponse, showErrorInNotificationCard } from "../../general/helper_methods";

const fullName = document.querySelector(".full-name");
const email = document.querySelector(".email");
const contact = document.querySelector(".contact-number");
const username = document.querySelector(".username")
const password = document.querySelector(".password");
const p_confirmation = document.querySelector(".password-confirmation");

const validations = {
  hasAny: (resource) => resource.length > 0,
  fullNameMaxLen: () => fullName.value.length > 25,
  fullNameRegex: () => fullName.value.length > 0 && !(/^[A-Za-z\s]+$/).test(fullName.value),
  fullNameMinLen: () => fullName.value.length < 3,
  isFullNameEmpty: () => fullName.value.length == 0,
  isUsernameEmpty: () => username.value.length == 0,
  usernameMinLen: () => username.value.length < 3,
  usernameMaxLen: () => username.value.length > 25,
  isEmailEmpty: () => email.value.length == 0,
  emailFormat: () => /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value),
  contactMaxLen: () => contact.value.length > 10,
  passwordMinLen: () => password.value.length < 8,
  pwdNotConfirm: () => password.value !== p_confirmation.value

}

// NAME VALIDATIONS
fullName.addEventListener("keyup", function(event) {
  const errors = [];
  if (validations.fullNameMaxLen()) errors.push("Name can have maximum 25 characters")
  if (validations.fullNameRegex()) errors.push("Name can contains characters only")
  if (validations.hasAny(errors)) {
    showErrorInNotificationCard(errors);
  }
});

fullName.addEventListener("blur", function(event) {
  const errors = [];

  if (validations.isFullNameEmpty()) {
    errors.push("Name can't be blank")
  } else if (validations.fullNameMinLen()) {
    errors.push("Name must have 3 letters")
  }
  if (errors.length > 0) {
    showErrorInNotificationCard(errors);
  }
});

// USERNAME VALIDATIONS
username.addEventListener("blur", async function(event) {
  const value = event.target.value;
  const charLen = value.length;
  const errors = [];

  if (validations.isUsernameEmpty()) {
    errors.push("Username can't be blank")
  } else if (validations.usernameMinLen()) {
    errors.push("Username must have 3 letters")
  } else {
    const path = `/api/v1/is_taken_cred?username=${value}`;
    const response = await fetch(path, reqHeaders("GET"));
    const username = await response.json();
    switch (response.status) {
      case 409:
        errors.push("Username is already taken");
        break;
      case 200:
        console.log("OK");
        break;
      default:
        showErrorInNotificationCard(username)
        break;
    }
  }
  if (errors.length > 0) {
    showErrorInNotificationCard(errors);
  }
});

username.addEventListener("keyup", function(event) {
  const value = event.target.value;
  const errors = [];

  if (validations.usernameMaxLen()) {
    errors.push("Username can have maximum 25 characters")
    event.target.value = value.slice(0, 25);
  }
  if (errors.length > 0) {
    showErrorInNotificationCard(errors);
  }
});

// EMAIL VALIDATIONS
email.addEventListener("blur", async function(event) {
  const e = event.target;
  const value = e.value;
  
  if (validations.isEmailEmpty()) {
    showErrorInNotificationCard("Email must be present")
  } else if (!validations.emailFormat()) {
    showErrorInNotificationCard("Email is invalid!");
  } else {
    const path = `/api/v1/is_taken_cred?email=${value}`
    const response = await fetch(path, reqHeaders("GET"));
    const message = await response.json()

    if (!response.ok) {
      showErrorInNotificationCard(message)
    }
  }

})

contact.addEventListener("keyup", (e) => {
  const value = e.currentTarget.value;
  if (isNaN(Number(value))) {
    showErrorInNotificationCard("Contact must contains numbers only");
  } else if (value.length > 10) {
    showErrorInNotificationCard("Contact must have maximum length of 10")
  }
});

p_confirmation.addEventListener("blur", (e) => {
  const errors = [];

  if (validations.pwdNotConfirm()) {
    errors.push("Password confirmation didn't match")
  }
  if (validations.hasAny(errors)) {
    showErrorInNotificationCard(errors);
  }
})