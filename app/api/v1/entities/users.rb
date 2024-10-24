module V1
  module Entities
    class Users < Base
      expose :id
      expose :full_name, as: :name
      expose :role
    end
  end
end
