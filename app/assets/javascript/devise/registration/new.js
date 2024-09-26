import { showErrorInNotificationCard } from "../../general/helper_methods";

const contact = document.querySelector(".contact-number");
console.log(contact);

contact.addEventListener("keyup", (e) => {
  const value = e.currentTarget.value;
  if (Number(value) == NaN) {
    showErrorInNotificationCard("Contact must contains numbers only");
  } else if (value.length > 10) {
    showErrorInNotificationCard("Contact must have maximum length of 10")
  }
});
