export const confirmBtn = function(props={}) {
  const btnContentText = "Confirm"
  return `<button 
            class="app-action-btn cancel-appt-btn"
            data-appt-confirm-id="${props.id}"
            data-appt-action-type="confirmed">
              ${btnContentText} 
          </button>`;
}