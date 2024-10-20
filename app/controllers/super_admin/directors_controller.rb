module SuperAdmin
  class DirectorsController < ApplicationController
    include ListAppointments
    def add_doctor
      @hospitals = Hospital.all
    end

    def add_hospital
      @specializations = Specialization.all
    end

    def list_users
      params[:per_page] = params[:per_page] || 20
      case params[:role]
      when "doctor"
        @users = DoctorProfile.includes(:doctor, {department: [:hospital, :specialization]}).paginate(will_paginate).order(created_at: :desc)
        render template: "super_admin/directors/list_users/doctors"
      when "patient"
        @users = User.includes(:patient_appointments).patient.order("role DESC, full_name ASC").paginate(will_paginate)
        render template: "super_admin/directors/list_users/patients"
      else
        @users = User.includes(:doctor_profile).order(created_at: :desc).where.not(id: current_user.id).paginate(will_paginate)
        render template: "super_admin/directors/list_users/base"
      end
    end
    
    def invitations
    end
    
  end
end