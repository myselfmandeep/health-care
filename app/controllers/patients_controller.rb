class PatientsController < ApplicationController
  include ListAppointments
  set_user_access :is_support_user?, except: %i[show]

  def index
    @patients = User.patient
  end

  def show
    @patient = User.find(params[:id])
  end
  
end