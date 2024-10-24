class AppointmentsScope < ApplicationScope
  def list
    return eager_load if super_admin?

    return doctor_scope if doctor?

    return patient_scope if patient?

    []
  end

  def doctor_scope
    eager_load.where(doctor_id: user.id) if doctor?
  end

  def patient_scope
    eager_load.where(patient_id: user.id)
  end

  def eager_load
    @appts ||= Appointment.includes(:doctor, :patient, :feedbacks)
  end
end
