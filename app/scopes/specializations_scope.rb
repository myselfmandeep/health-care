class SpecializationsScope < ApplicationScope
  def list
    return eager_load unless user.try(:doctor?)

    eager_load.where(departments: { hospital_id: user.doctor_profile.department.hospital_id })
  end

  def eager_load
    @scope ||= Specialization.includes(departments: :doctor_profiles)
  end
end
