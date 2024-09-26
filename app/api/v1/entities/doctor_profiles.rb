module V1
  module Entities
    class DoctorProfiles < Base
      expose :id, documentation: { type: "Integer", desc: "User ID" }, 
             proc: -> (profile, options) { profile.doctor.id }
      expose :doctor_full_name, as: :doctor, documentation: { type: "String", desc: "Doctor's name" }
      expose :start_at, documentation: { type: "String", desc: "Shift start time" }
      expose :end_at, documentation: { type: "String", desc: "Shift end time" }
      expose :slot_duration, documentation: { type: "Integer", desc: "Slot duration in minutes" }
      expose :experience_time, documentation: { type: "Integer", desc: "Years of experience" }
      expose :highest_qualification, documentation: { type: "String", desc: "Highest qualification" }
    end
  end
end
