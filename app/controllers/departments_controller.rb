class DepartmentsController < ApplicationController
  set_user_access :is_support_user?
  
  def doctors
    @doctors = Department.eager_load(:specialization, {doctor_profiles: :doctor}).find(params[:id]).doctor_profiles
  end
  
end