class CancelAppointmentJob
  include Sidekiq::Worker

  def perform(*args)
    appointments = Appointment.where("status = 0 AND date < ?", Date.today)
    appointments.each { |appointment| appointment.update(status: :cancelled, cancellation_reason: "Expired due to no approval by doctor") };
  end

end