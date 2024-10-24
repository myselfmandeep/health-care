module V1
  class DoctorProfiles < Grape::API
    # mount({Votes => "/doctor"}, with: {resource: "DoctorProfile"})

    desc "collection routes of doctors"
    resource :doctor_profiles do
      desc "list all the doctors"
      params do
        optional :specialization_id, type: Integer, desc: "List doctors of specific specialization"
      end
      get do
        doctors = unless params[:specialization_id].present?
                    DoctorProfile.includes([ :department, :doctor ])
        else
                    DoctorProfile.includes([ :department, :doctor ]).where(departments: { specialization_id: params[:specialization_id] })
        end

        present(doctors, with: V1::Entities::DoctorProfiles)
      end

      desc "returns the booked slots of doctor for a specific day"
      params do
        requires :doctor_id, type: Integer, desc: "Doctor ID"
        requires :date, type: String, allow_blank: false, desc: "Date to check"
      end
      get :check_availability do
        statuses = Appointment.statuses
        filter = { date: params[:date], doc: params[:doctor_id], rejected: statuses[:rejected], cancelled: statuses[:cancelled] }

        Appointment.where("doctor_id = :doc AND date = :date AND status != :rejected AND status != :cancelled", filter).pluck(:timeslot)
      end

      desc "member routes of doctors"
      namespace ":id" do
        mount Votes, with: { resource: "DoctorProfile" }

        params do
          requires :id, type: Integer, desc: "Doctor ID"
        end

        before do
          @doctor = DoctorProfile.find(params[:id])
        end

        desc "retrun the single doctor record"
        get do
          present @doctor, with: V1::Entities::DoctorProfiles
        end
      end
    end
  end
end
