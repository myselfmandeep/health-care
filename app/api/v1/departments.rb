module V1
  class Departments < Grape::API

    desc "collection routes of department"
    resource :departments do
      
      desc "get the list of all departments"
      params do
        requires :hospital_id, type: Integer, desc: "choose the hospital to list the departments of hospital"
      end
      get do
        hosptial = Hospital.includes(departments: :specialization).find(params[:hospital_id])
        departments = hosptial.departments
        present departments, with: V1::Entities::Departments
      end
      
    end
  end
end