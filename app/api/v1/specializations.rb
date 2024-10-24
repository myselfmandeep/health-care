module V1
  class Specializations < Grape::API
    desc "specializations collection routes"
    resource :specializations do
      desc "get list of specializations"
      get do
        specializations = Specialization.order(:name)
        present(specializations, with: V1::Entities::Specializations)
      end
    end
  end
end
