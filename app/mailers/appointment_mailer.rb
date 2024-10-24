class AppointmentMailer < ApplicationMailer
  def feedback_mail(appointment)
    @appointment = appointment
    @patient = @appointment.patient
    @doctor = @appointment.doctor
    mail(to: @patient.email, subject: "Please share your feedback #{@patient.full_name}")
  end
end
