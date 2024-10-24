module V1
  module SuperAdmin
    class Hospitals < Grape::API
      resource :hospitals do
        desc "create hospital"
        params do
          requires :name, type: String, regexp: /\A[a-zA-Z\s]+\z/, desc: "Hospital Name"
          requires :departments, type: Array[Integer], desc: "Specializations IDs"
        end
        post do
          declared_params = declared(params)
          hospital = Hospital.new(declared_params.slice(:name))

          declared_params.dig(:departments).each do |spec_id|
            hospital.departments.new(specialization_id: spec_id)
          end

          if hospital.save
            present hospital, with: V1::Entities::Hospitals
          else
            error_response!(hospital.full_error_messages, 422)
          end
        end

        namespace ":id" do
          params do
            requires :id, type: Integer, desc: "unique id of hospital"
          end

          before do
            @hospital = Hospital.find(params[:id])
          end

          desc "update hospital record"
          params do
            optional :name, type: String, regexp: /\A[a-zA-Z\s]+\z/, desc: "Hospital Name"
            optional :departments, type: Array[Integer], desc: "Specialization IDs"
          end
          put do
            name, departments = params[:name], params[:departments]
            if name.present?
              unless @hospital.update(name: params[:name])
                error_response!(@hospital.full_error_messages, 422)
              end
            end
            if departments.present?
              departments.each do |spec_id|
                @hospital.departments.new(specialization_id: spec_id).save
              end
            end

            present @hospital, with: V1::Entities::Hospitals
          end

          desc "delete hospital record"
          delete do
            if @hospital.destroy
              { message: "#{@hospital.name} has been destroyed successfully", success: true }
            else
              error_response!("Something went wrong", 405)
            end
          end
        end
      end
    end
  end
end
