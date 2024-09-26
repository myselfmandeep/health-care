class DepartmentsController < ApplicationController
  
  def doctors
    @doctors = Department.eager_load(:specialization, {doctor_profiles: :doctor}).find(params[:id]).doctor_profiles
  end
  
end