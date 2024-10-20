class AppointmentsController < ApplicationController
  before_action :authenticate_user!
  set_user_access :is_support_user?

  def index
    mark_active_tab("appts") 
  end
  
  def feedback
    @appt = Appointment.includes(:doctor).find_by(appt_code: params[:appt_code])
    if @appt.nil?
      redirect_to root_path, notice: "Unrecognized appointment code"
    elsif @appt.patient != current_user
      redirect_to root_path, notice: "This appointment doesn't belongs to you"
    elsif @appt.feedbacks.any?
      redirect_to root_path, notice: "You have already submitted your valueable feedback"
    end
  end
end