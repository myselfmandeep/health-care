class WelcomeController < ApplicationController
  def dashboard
  end

  def home
    @doctors = DoctorProfile.includes([ :doctor, { department: :specialization } ]).paginate(page: params[:page], per_page: 16)
  end
end
