module V1
  module Entities
    class Appointments < Base
      expose :id, documentation: { type: "Integer", desc: "ID of the appointment" }
      expose :doctor_name, documentation: { type: "String", desc: "Name of the doctor associated with the appointment" }, proc: ->(appointment, _options) {appointment.doctor.full_name}
      expose :patient_name, documentation: { type: "String", desc: "Name of the patient who booked the appointment" }, proc: ->(appointment, _options) {appointment.patient.full_name}
      expose :timeslot, documentation: { type: "String", desc: "Time slot for the appointment (e.g., 09:00-09:30)" }
      expose :date, documentation: { type: "Date", desc: "Date of the appointment" }
      expose :status, documentation: { type: "String", desc: "Current status of the appointment (e.g., confirmed, pending)" }
      expose :medical_history, expose_nil: false, documentation: { type: "String", desc: "Medical history of patient" }
      expose :symptoms, expose_nil: false, documentation: { type: "String", desc: "symptoms patient have" }
      expose :cancellation_reason, expose_nil: false, documentation: { type: "String", desc: "Reason of appointment cancellation" }
      expose :patient_id, documentation: {type: Integer, desc: "Patient IDs"}
      expose :appt_code, as: :code, documentation: {type: String, desc: "Uniq Appointment Code"}, if: -> (appt,_opts) { appt.fulfilled? }
      expose :has_feedback, documentation: {type: String, desc: "Uniq Appointment Code"}, if: -> (appt,_opts) { appt.fulfilled? } do |appt, _opts|
        appt.feedbacks.any?
      end
    end
  end
end
