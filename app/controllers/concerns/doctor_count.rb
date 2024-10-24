module DoctorCount
  extend ActiveSupport::Concern

  def hospital_dr_count
    @dr_count = DoctorProfile.joins(department: :hospital)
                              .group("departments.hospital_id")
                              .count
  end
end
