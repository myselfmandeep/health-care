import { getBody } from "./helper_methods";

const spinner =  () => document.querySelector(".spinner");

export const showSpinner = () => {
  if (!!spinner()) { return };
  getBody().insertAdjacentHTML("afterbegin", `<div class="spinner"></div>`)
};

export const removeSpinner = () => {
  if (!!spinner()) {
    spinner().remove()
  };
}

try {
  const domId = document.querySelector("[data-element-id]");
  const eventDelegators = document.querySelector(`#${domId.dataset.elementId}`)
  console.log("trycatch");
  eventDelegators.addEventListener("click", (event) => {
    showSpinner();
  });
} catch (error) {
  console.error(error);
}

// console.log(eventDelegators);