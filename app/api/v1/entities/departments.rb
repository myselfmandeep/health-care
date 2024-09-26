module V1
  module Entities
    class Departments < Base
      expose :id
      expose :specialization_name, as: :dep_name
      expose :specialization_id, as: :spec_id
      # expose :specialization, with: Specializations
    end
  end
end
