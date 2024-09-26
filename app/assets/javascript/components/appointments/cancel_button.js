export const cancelBtn = function(props={}) {
  const btnContentText = "Cancel"

  return `<button 
            class="app-action-btn cancel-appt-btn"
            data-appt-cancel-id="${props.id}"
            data-appt-action-type="cancelled">
            ${btnContentText}
          </button>`
}