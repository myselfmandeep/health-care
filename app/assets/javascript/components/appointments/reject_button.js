export const rejectBtn = function(props={}) {
  const btnContentText = "Reject"
  
  return `<button 
            class="app-action-btn cancel-appt-btn"
            data-appt-reject-id="${props.id}"
            data-appt-action-type="${props.actionType}">
            ${btnContentText}
          </button>`
}