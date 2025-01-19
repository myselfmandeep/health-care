class DoctorsController < ApplicationController
  include ListAppointments
  set_user_access :is_support_user?

  before_action :get_doctor, only: %i[book_appointment dashboard]
  before_action :get_dr_profile, only: %i[edit update]

  def index
    # @doctors =  doctor_scope.list
    docs = eager_load_doctors

    docs.tap { |q| q.where!("hospitals.name = ?", params[:hospital]) if params[:hospital].present? }
        .tap { |q| q.where!("specializations.name = ?", params[:specialization]) if params[:specialization].present? }
        .tap { |q| q.order!(updated_at: :desc) }

    @doctors = docs.paginate(will_paginate)
  end

  def availability
  end

  def show
    @doctor = DoctorProfile.includes(:doctor, department: :specialization).find_by(doctor: { id: params[:id] })
  end

  def edit
  end

  def update
    if @dr_profile.update(dr_params)
      redirect_to doctors_path, notice: "Successfully updated Dr profile"
    else
      render :edit
    end
  end

  def dashboard
    mark_active_tab("dashboard")
    @appointments = @doctor.doctor.doctor_appointments.where(date: Date.today, status: :confirmed).order(:timeslot)
    # @appointments = Appointment.confirmed
    # @feedbacks = Feedback.includes({appointment: [:doctor]}, :user).where(appointments: {doctor_id: @doctor.doctor_id})
    # params[:per_page] = params[:per_page] || 5
    @feedbacks = Feedback.includes(:user, :appointment).where(appointment_id: @doctor.doctor.doctor_appointments.pluck(:id)).paginate(will_paginate)
    @like_dislikes = @doctor.like_dislikes
  end

  def book_appointment
  end

  def search
    @doctors = eager_load_doctors.where("users.full_name ILIKE ?", "%#{params[:query]}%").paginate(pagination(20))
    render template: "doctors/index"
  end

  private

  def get_dr_profile
    @dr_profile = DoctorProfile.find(params[:id])
  end

  def dr_params
    params.require(:dr).permit(:start_at, :end_at, :slot_duration, :experience_time, :highest_qualification)
  end

  def get_doctor
    @doctor = eager_load_doctors.find(params[:id])
  end

  def eager_load_doctors
    load_doctor_profiles.where("users.state = 0")
  end

  def doctor_scope
    @doc ||= DoctorsScope.new(current_user)
  end
end
