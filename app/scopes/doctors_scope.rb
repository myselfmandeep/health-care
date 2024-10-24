class DoctorsScope < ApplicationScope
  def list
    return eager_load_doctors if user.nil? || !user.doctor?

    eager_load_doctors.where(departments: { hospital_id: user.doctor_profile.department.hospital_id })
  end


  def eager_load_doctors
    @doctors ||= DoctorProfile.eager_load(:doctor,  { department: [ :hospital, :specialization ] })
                            .where.not(users: { state: [ :suspended, :removed ] })
  end
end
