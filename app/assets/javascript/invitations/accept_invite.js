import { showErrorInNotificationCard } from "../general/helper_methods";

console.log("accept invite");

const pwd = document.querySelector(".pwd");
const pwdConfirm = document.querySelector(".pwd-confirm")
const setPwd = document.querySelector(".set-pwd");

const validPassword = () => {
  const val1 = pwd.value;
  const val2 = pwdConfirm.value;

  const showError = (message) => {
    showErrorInNotificationCard(message);
    return false;
  };

  if (val1.length < 8) {
    return showError("Minimum length of password should be 8");
  } else if (val1 !== val2) {
    return showError("Password confirmation didn't match with password");
  } 

  return true;  // Return true if all validations pass
};


setPwd.addEventListener("click", function(event) {
  const btn = event.target;
  const password = pwd.value;
  const passwordConfirmation = pwdConfirm.value;

  // if (!(password && passwordConfirmation)) {
  if (!validPassword()) {
    event.preventDefault();
    console.log("prevent by default");
  }

});