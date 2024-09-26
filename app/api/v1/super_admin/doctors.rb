module V1
  module SuperAdmin
    class Doctors < Grape::API

      desc "create users with doctors roles and assign doctor roles to existing users"
      resource :doctors do

        desc "creating new doctor"
        params do
          requires :email, type: String, desc: "user Email"
          requires :full_name, type: String, desc: "user name"
          requires :password, type: String, desc: "password of user"
          optional :username, type: String, desc: "unique username"
          requires :password_confirmation, type: String, desc: "password of user"
          requires :gender, type: String, values: %w[male female other], desc: "gender of user"
          requires :date_of_birth, type: String, desc: "Dr date of birth"
          requires :role, type: String, default: "doctor", desc: "Doctor role"
          
          requires :doctor_profile, as: :doctor_profile_attributes, type: Hash do
            requires :department_id, type: Integer, desc: "Department Dr belongs to"
            requires :start_at, type: String, desc: "shift start time"
            requires :end_at, type: String, desc: "shift end time"
            requires :slot_duration, type: Integer, desc: "each slot duration"
            requires :years_of_experience, as: :experience_time, type: Integer, desc: "years of experience"
            requires :highest_qualification, type: String, desc: "higest qualification"
          end
        end
        post "/add_new_doctor" do
          doctor = User.new(declared(params))
          if doctor.save
            {success: true}
          else
            error!({errors: doctor.full_error_messages}, 422)
          end
        end

        namespace ":id" do
          
          desc "get doctor"
          params do
            requires :id, type: Integer, desc: "Dr User ID"
          end
          before do
            @doctor = User.find(params[:id])
          end
          
          get do
            present @doctor.doctor_profile, with: V1::SuperAdmin::Entities::DoctorProfiles
          end
        end

        desc "update doctor"
        params do
          requires :id, type: Integer, desc: "doctor id"
          optional :name, type: String, desc: "user name"
          optional :email, type: String, desc: "user Email"
          optional :password, type: String, desc: "password of user"
          optional :username, type: String, desc: "unique username"
          optional :date_of_birth, type: String, desc: "date of birth"
          optional :gender, type: String, values: %w[male female other], desc: "gender of user"
          optional :role, type: String, values: ["doctor"], desc: "doctor role"
          at_least_one_of *%w[name email password username date_of_birth gender role], message: "are missing, please specify at least one param"
        end
        put "/:id/update_doctor" do
          doctor = User.find(params[:id])
          
          if doctor.update((declared(params, include_missing: false)))
            success_response!("Successfully added doctor")
          else
            error_response!(doctor.full_error_messages)
          end
        end
      end
    end
  end
end