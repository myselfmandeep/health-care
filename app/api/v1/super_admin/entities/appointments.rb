module V1
  module SuperAdmin
    module Entities
      class Appointments < Base
        expose :timeslot
        expose :date
      end
    end
  end
end
