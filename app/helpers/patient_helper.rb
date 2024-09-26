module PatientHelper

  def appointment_count_details(patient)
    appointments= patient.appointments
    count = appointments.size

    if count > 0
      link_to "#{count}", appointments_patient_path(patient)
    else
      count
    end
  end

  def determine_appointments_path(status:nil)
    resource_id = params[:id]

    if status.nil?
      if current_user.super_admin?
        appointments_su_director_path
      else
        appointments_doctor_path(resource_id)
      end
    else
      if current_user.super_admin?
        appointments_su_director_path(status: status)
      elsif current_user.patient?
        appointments_patient_path(resource_id, status: status)
      else
        appointments_doctor_path(resource_id, status: status)
      end
    end
  end

  def show_doctor_th
    content_tag(:th, "Dr.", scope: "col") if is_super_admin? || is_patient?
  end
  
  def show_doctor_td(appointment)
    content_tag(:td, appointment.doctor_full_name) if is_super_admin? || is_patient?
  end

  def is_patient?
    current_user.try(:patient?)
  end

  def is_doctor?
    current_user.try(:doctor?)
  end

  
end