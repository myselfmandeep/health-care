module ListAppointments
  extend ActiveSupport::Concern

  def appointments
    @appointments = scope
    
    case params[:status]
    when "requested"
      @appointments = @appointments.requested
      render template: "doctors/appointments/requested"
    when "confirmed"
      @appointments = @appointments.confirmed
      render template: "doctors/appointments/confirmed"
    when "rejected"
      @appointments = @appointments.rejected
      render template: "doctors/appointments/rejected"
    when "cancelled"
      @appointments = @appointments.cancelled
      render template: "doctors/appointments/cancelled"
    else 
      render template: "doctors/appointments/base"
    end
  end

  private
  
  def scope
    preload = Appointment.includes([:patient, :doctor])
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