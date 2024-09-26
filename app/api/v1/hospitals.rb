module V1
  class Hospitals < Grape::API
    
    resource :hospitals do
      
      desc "list all the hospitals"
      get do
        present Hospital.all, with: V1::Entities::Hospitals
      end

      desc "get hospital record with id"
      params do
        requires :id, type: Integer, desc: "unique id of hospital"
      end
      get do
        hospital = Hospital.find(params[:id])
        present hospital, with: V1::Entities::Hospitals
      end

      namespace ":id" do
        desc "member actions of hospitals"
        params do
          requires :id, type: Integer, desc: "Hospital ID"
        end  

        desc "Fetch doctors of single department"
        params do 
          requires :specialization_id, type: Integer, desc: "Specializatin ID"
        end
        get "/get_doctors" do
          doctors = DoctorProfile.includes(:department).where(departments: {specialization_id: params[:specialization_id], hospital_id: params[:id]})

          present doctors, with: V1::Entities::DoctorProfiles
        end
        
      end
    end
    
  end  
end