class FeedbackScope < ApplicationScope
  def list
    return eager_load.where(appointment_id: user.doctor_appointments.pluck(:id)) if doctor?

    return eager_load.where(appointment_id: user.patient_appointments.pluck(:id)) if patient?

    []
  end

  def eager_load
    @eager_loaded ||= Feedback.includes(:user, :appointment)
  end
end
