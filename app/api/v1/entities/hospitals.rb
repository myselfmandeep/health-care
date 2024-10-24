module V1
  module Entities
    class Hospitals < Base
      expose :id
      expose :name
      expose :departments, with: Departments
    end
  end
end
