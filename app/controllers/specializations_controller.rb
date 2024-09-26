class SpecializationsController < ApplicationController
  include DoctorCount

  def index
    @hosp_count = DoctorProfile.joins(:department).group("departments.hospital_id").count
    @specializations = scope.list.order(:name).paginate(will_paginate)
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