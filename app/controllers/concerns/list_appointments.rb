module ListAppointments
  extend ActiveSupport::Concern

  def appointments
    @appointments = scope

    template = ->(temp) { "doctors/appointments/#{temp}" }

    case params[:status]
    when "requested" then set_layout(@appointments.requested, template["requested"])
    when "confirmed" then set_layout(@appointments.confirmed, template["confirmed"])
    when "rejected"  then set_layout(@appointments.rejected,  template["rejected"])
    when "cancelled" then set_layout(@appointments.cancelled, template["cancelled"])
    else set_layout(@appointments, template["base"])
    end
  end

  private

  def scope
    preload = Appointment.includes([ :patient, :doctor ])
                         .order(created_at: :desc)
                         .paginate(will_paginate)

    if current_user.patient?
      preload.where(patient_id: params[:id])
    elsif current_user.doctor?
      preload.where(doctor_id: params[:id])
    elsif current_user.super_admin?
      preload
    end
  end
end
