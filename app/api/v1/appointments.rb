module V1
  class Appointments < Grape::API
    desc "collection routes of appointments"
    resource :appointments do
      desc "list all doctor appointments"
      params do
        optional :order_by, type: String, values: %w[ASC DESC], default: "DESC", desc: "Sort order: ascending or descending"
      end
      get "/" do
        # appointments = Appointment.includes(:doctor, :patient).where("doctor_id = :id OR patient_id = :id", id: current_user.id);
        scope = AppointmentsScope.new(current_user)
        appointments = scope.list

        if params[:date]
          appointments = appointments.where(date: params[:date])
        end
        if params[:doctor_name]
          appointments = appointments.where(doctor_id: User.doctor.where("full_name ILIKE ?", "%#{params[:doctor_name]}%").ids)
        end
        if params[:patient_name]
          appointments = appointments.where(patient_id: User.patient.where("full_name ILIKE ?", "%#{params[:patient_name]}%").ids)
        end
        if params[:timeslot]
          appointments = appointments.where(timeslot: params[:timeslot])
        end

        case params[:status]
        when "requested"
          appointments = appointments.requested
        when "confirmed"
          appointments = appointments.confirmed
        when "cancelled"
          appointments = appointments.cancelled
        when "rejected"
          appointments = appointments.rejected
        when "fulfilled"
          appointments = appointments.fulfilled
        when "upcoming"
          appointments = appointments.where("date > ? AND status = ?", Date.today, Appointment::STATUS[:confirmed])
        else
          appointments
        end

        # appointments = appointments.order(created_at: :desc).paginate({
        appointments = appointments.order("created_at #{params[:order_by]}").paginate({
          page: params[:page],
          per_page: (params[:per_page] || 25)
        })

        present(appointments, with: V1::Entities::Appointments)
      end

      desc "create new appointment by patient user"
      params do
        requires :doctor_id, type: Integer, desc: "Patient ID"
        requires :timeslot, type: String, desc: "Patient ID"
        requires :date, type: String, desc: "Date for appointment"
        optional :medical_history, type: String, desc: "any medical history patient have"
        optional :symptoms, type: String, desc: "symptoms patient have"
      end
      post do
        appointment = current_user.patient_appointments.new(declared(params))
        error_response!("Please sign in as a patient to perform this action") unless current_user.patient?

        if appointment.save
          message = "#{appointment.patient_full_name} has requested a new appointment for #{appointment.date}, at #{appointment.timeslot}."
          Notification.notify_user(message: message, user_id: params[:doctor_id], type: "new_appointment", doctor_id: params[:doctor_id])
          present(appointment, with: V1::Entities::Appointments)
        else
          error_response!(appointment.full_error_messages, 422)
        end
      end

      namespace ":id" do
        params do
          requires :id, type: Integer, desc: "Appointment ID"
        end
        before do
          @appointment = Appointment.find(params[:id])
        end

        get "/" do
          present @appointment, with: V1::Entities::Appointments
        end

        desc "update the status of appointment"
        params do
          requires :status, type: String, values: %w[confirmed rejected cancelled fulfilled], desc: "Appointment ID"
          optional :cancellation_reason, type: String, desc: "Cancellation reason of appointment"
          given :cancellation_reason do
            requires :cancelled_at, type: Time, desc: "Cancellation time", default: -> { Time.now }
            requires :cancelled_by, type: String, values: %w[patient doctor], desc: "Doctor OR Patient"
          end
        end
        put "/change_status" do
          if @appointment.update(declared(params, include_missing: false))
            status = @appointment.rejected?  ? "cancelled" : @appointment.status
            message = "Your appointment scheduled for #{@appointment.date} at #{@appointment.timeslot} has been #{status}."
            broadcast_to = @appointment.patient == current_user ? @appointment.doctor_id : @appointment.patient_id
            Notification.notify_user(message: message, user_id: broadcast_to)

            present @appointment, with: V1::Entities::Appointments
          else
            error_response!(@appointment.full_error_messages, 422)
          end
        end
      end
    end
  end
end
