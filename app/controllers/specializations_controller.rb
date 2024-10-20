class SpecializationsController < ApplicationController
  include DoctorCount
  set_user_access :is_support_user?

  def index
    mark_active_tab("specializations") 
    @hosp_count = Hospital.joins(:departments).group("departments.specialization_id").count
    @dr_count = DoctorProfile.joins(:department).group("departments.specialization_id").count

    if current_user && current_user.doctor?
      @dr_count = DoctorProfile.joins(:department).where("departments.hospital_id = ?", current_user.doctor_profile.department.hospital_id).group("departments.specialization_id").count
    end
    if params[:without_dr] == "false"
      @specializations = scope.list.joins(departments: :doctor_profiles)
    else
      @specializations = scope.list
    end

    @specializations = @specializations.order(:name).paginate(will_paginate)
  end

  def hospitals
    @dr_count = hospital_dr_count
    @hospitals = Hospital.includes(:departments).where(departments: {specialization_id: params[:id]}).paginate(will_paginate)

    render template: "hospitals/index"
  end
  
  def doctors
    doc_scope = DoctorsScope.new(current_user)
    @doctors = doc_scope.list.where(specializations: {id: params[:id]})

    render template: "hospitals/doctors"
  end

  def search
    @specializations = Specialization.where("name ILIKE ?", "%#{params[:query]}%").paginate(pagination(10))
    render template: "specializations/index"
  end

  def scope
    @scope ||= SpecializationsScope.new(current_user)
  end

end