module V1
  module SuperAdmin
    module Entities
      class DoctorProfiles < Base
        expose :start_at, :end_at, :slot_duration, :experience_time, :highest_qualification
        expose :appointments, using: Appointments do |profile, options|
          profile.doctor.doctor_appointments
        end
        expose :doctor_name, as: :doctor
      end
    end
  end
end