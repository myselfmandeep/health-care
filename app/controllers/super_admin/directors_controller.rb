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

      template = ->(temp) { "super_admin/directors/list_users/#{temp}" }

      case params[:role]
      when "doctor" then set_layout(load_doctor_profiles, template["doctors"])
      when "patient" then set_layout(User, template["patients"])
      else set_layout(User.includes(:doctor_profile).where.not(id: current_user.id), template["base"])
      end
    end

    def invitations
    end
  end
end
