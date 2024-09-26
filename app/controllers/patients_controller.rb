class PatientsController < ApplicationController
  include ListAppointments

  def index
    @patients = User.patient
  end

  def show
    @patient = User.find(params[:id])
  end
  
end