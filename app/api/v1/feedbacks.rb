module V1
  class Feedbacks < Grape::API

    resource :feedbacks do
      
      desc "Get the list of feedbacks for particular appointment"
      params do
        requires :appointment_id, type: Integer, desc: "Appointment ID"
      end
      get "/" do
        feedbacks = Feedback.includes(:appointment, :user).where(appointments: {id: params[:appointment_id]})

        present feedbacks, with: V1::Entities::Feedbacks
      end

      desc "Create Feedback"
      params do
        requires :body, type: String, desc: "Content for feedback"
        requires :user, as: :user_id, type: Integer, desc: "Person Leaving Feedback"
        optional :appt_id, as: :appointment_id, type: Integer, desc: "Appointment ID"
        # optional :appt_code, type: Integer, desc: "Appointment Unique Code"
        optional :feedback_id, as: :parent_feedback_id, type: Integer, desc: "Parent FeedBack ID"
        exactly_one_of :appt_id, :feedback_id
      end
      post do
        feedback = Feedback.new(declared(params, include_missing: false))
        if feedback.save
          status 201
        else
          error_response!(feedback.full_error_messages)
        end
      end
      
      namespace ":id" do
        before do
          @feedback = Feedback.find(params[:id])
        end
        desc "Get replies of feedback"
        get "/replies" do
          present @feedback.replies, with: V1::Entities::Feedbacks
        end
      end
    end
  end
end