import { eventHandler } from "../../appointments/event_handlers";

export const confirmationToolip = function(props={}, parentElement) {
  const toolip = `
                  <div class="confirmation-toolip" id="confirmation-toolip-${props.id}">
                    <p>Are you sure</p>
                    <div class="options">
                      <button class="opt opt-yes" 
                              data-toolip-appt-id="${props.id}" 
                              data-appt-action-type="${props.actionType}"
                              data-appt-cancellation-reason="${props.reason}">
                            yes
                        </button>
                      <button class="opt opt-no">No</button>
                    </div>
                  </div>
                `;
  
  parentElement.insertAdjacentHTML("afterend", toolip);
  const openToolip = document.querySelector(`#confirmation-toolip-${props.id}`);

  const toolipCloseBtn = document.querySelector(".opt-no");
  toolipCloseBtn.addEventListener("click", () => {
    if (!!openToolip) { openToolip.remove() }
  });

  const toolipYesBtn = document.querySelector(`[data-toolip-appt-id='${props.id}']`);

  toolipYesBtn.addEventListener("click", eventHandler.changeStatusOfAppt)

};