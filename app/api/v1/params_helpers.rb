module V1
  module ParamsHelpers
    extend ::Grape::API::Helpers

    params :doctor do
      requires :doctor_id, type: Integer, desc: "Dr ID"
    end
  end
end
