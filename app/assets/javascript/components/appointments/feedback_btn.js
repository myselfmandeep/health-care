export const feedbackBtn = function(props={}) {
  const btnContentText = "Feedback"

  return `<button 
            class="app-action-btn"
            data-appt-code=${props.apptCode}>
            ${btnContentText}
          </button>`
}