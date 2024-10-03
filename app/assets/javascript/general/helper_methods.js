
let removeErrorTimeout; 
export const fadeOutElement = function(element, interval = 2000) {
  let opacity = 1;
  const step = 0.05;  // Step for opacity decrement

  const fadeStepTime = interval / (1 / step);

  const fadeOut = setInterval(() => {
    if (opacity > 0) {
      opacity -= step;
      if (!!element) element.style.opacity = opacity;
    } else {
      clearInterval(fadeOut);
      if (!!element) element.remove();
    }
  }, fadeStepTime);
};

export const getBody = () => document.querySelector("body");
export const isString = (element) => typeof element == "string";
export const isArray = (element) => Array.isArray(element);
export const isObject = (element) => !isArray(element) && typeof element == "object" && typeof element !== null;
export const reqHeaders = function(verb="GET") {
    return {
      method: verb,
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.token}` }
    };
};
export const removeAnElement = (element) => element.remove();
export const scrollToEnd = (container) => container.scrollTop = container.scrollHeight;
export const roles = {
  isPatient: () => localStorage.role === "patient",
  isDoctor: () => localStorage.role === "doctor",
  isSuperAdmin: () => localStorage.role === "super_admin",
  isGuest: () => localStorage.role == null
}

const parseErrorMessages = function(errs, result=[]) {
  const errors = result;
  if (!isString(errs)) {
    if (isObject(errs)) { 
      return parseErrorMessages(Object.values(errs), errors);
    };
    errs.forEach(element => {
      if (element == null) {
        return;
      } else if (isArray(element)) {
        return parseErrorMessages(element, errors);
      } else if (isObject(element)) {
        return parseErrorMessages(Object.values(element), errors);
      } else {
        errors.push(element);
      };
    });
  } else {
    errors.push(errs);
  };
  return errors;
};

export const showApiResponse = function (responseErrors,timeout=3500) {
  const errors = Array.from([responseErrors]).flat(5);
  const errorsMessages = errors.map(error => `<p>${error}</p>`).join("\n");
  const body = document.querySelector("body");
  const errorContainer = `<div class="flash-alert-messages">
                            ${errorsMessages}
                          </div>`
  ;
  body.insertAdjacentHTML("afterbegin", errorContainer);
  const flashAlertMessages = document.querySelector(".flash-alert-messages");
  setTimeout(() => fadeOutElement(flashAlertMessages), timeout);
};

export const showApiErrorResponse = (errs, timeout=4000) => {
  const errors = parseErrorMessages(errs);
  const checkExistingErrors = document.querySelector(".flash-alert-messages");
  if (!!checkExistingErrors) { checkExistingErrors.remove()};
  const errorsMessages = errors.map(error => `<p class="api-error-message">${error}</p>`).join("\n");
  const body = document.querySelector("body");
  const errorContainer = `<div class="flash-alert-messages">
                            ${errorsMessages}
                          </div>`
  ;
  body.insertAdjacentHTML("afterbegin", errorContainer);
  const flashAlertMessages = document.querySelector(".flash-alert-messages");
  setTimeout(() => fadeOutElement(flashAlertMessages), timeout);
};

export const showErrorInNotificationCard = (errs, timeout=4000) => {
  const errors = parseErrorMessages(errs);
  if (errors.length == 0) { return };
  const body = document.querySelector("body");
  const errorsHTML = errors.map(err=> `<p>${err}</p>`).join("\n");
  let errorContainer = document.querySelector(".notification-alert-card");
  if (!!errorContainer) { 
    clearTimeout(removeErrorTimeout);
    errorContainer.remove()
  };
  const cardHTML = `<div class="notification-alert-card">
                          ${errorsHTML}
                        </div>`
  ;
  body.insertAdjacentHTML("afterbegin", cardHTML);
  errorContainer = document.querySelector(".notification-alert-card");
  setTimeout(() => errorContainer.classList.add("show"), 1000);
  removeErrorTimeout = setTimeout(() => {
    errorContainer = document.querySelector(".notification-alert-card");
    if (!!errorContainer) { 
      errorContainer.classList.remove("show");
      setTimeout(() => {
        errorContainer.remove();
      }, 2000);
    }
  }, timeout);
};

export const showSuccessInNotificationCard = (errs, timeout=4000) => {
  const errors = parseErrorMessages(errs);
  if (errors.length == 0) { return };
  const body = document.querySelector("body");
  const errorsHTML = errors.map(err=> `<p>${err}</p>`).join("\n");
  let errorContainer = document.querySelector(".success-notification-alert-card");
  if (!!errorContainer) { 
    clearTimeout(removeErrorTimeout);
    errorContainer.remove()
  };
  const cardHTML = `<div class="success-notification-alert-card">
                          ${errorsHTML}
                        </div>`
  ;
  body.insertAdjacentHTML("afterbegin", cardHTML);
  errorContainer = document.querySelector(".success-notification-alert-card");
  setTimeout(() => errorContainer.classList.add("show"), 1000);
  removeErrorTimeout = setTimeout(() => {
    errorContainer = document.querySelector(".success-notification-alert-card");
    if (!!errorContainer) { 
      errorContainer.classList.remove("show");
      setTimeout(() => {
        errorContainer.remove();
      }, 2000);
    }
  }, timeout);
};

export const defaultErrorMessage = (error="WeeeeeeeEeeeeeeeeeee") => {
  console.log(error);
  showErrorInNotificationCard("Something went wrong", 5000)
};

export const closeModal = () => {
  const modal = document.querySelector(".modal-container");
  const modalCloseBtn = document.querySelector(".close-btn");

  modalCloseBtn.addEventListener("click", (event) => modal.style.display = "none");

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  
};

export const closeModal1 = (modal) => {
  const modalCloseBtn = modal.querySelector(".close-btn");

  modalCloseBtn.addEventListener("click", (event) => modal.style.display = "none");

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

};


export const removeNodes = function(parent) {
  [...parent.children].forEach(e=> e.remove())
};

export const assignBgToBody = function(color) {
  getBody().style.background = color;
};

export const chatSeeker = function(event) {
  const chatBtn = event.currentTarget;
  const drId = chatBtn.dataset.doctorId;
  const drName = chatBtn.dataset.doctorName;
  
  localStorage.setItem("requestedChat", drId)
  localStorage.setItem("requestedUserName", drName)

  location.href = "/chats";
}

export const get_user_id = function() {
  return localStorage.user_id
};