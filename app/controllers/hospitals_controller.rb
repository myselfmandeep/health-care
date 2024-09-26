class HospitalsController < ApplicationController
  include DoctorCount
  
  before_action :get_hospital, only: %i[departments doctors show edit]
  before_action :hospital_dr_count, only: %i[index search]

  def index
    @hospitals = Hospital.order(:name).paginate(pagination(20))
  end

  def departments
    @dr_count = DoctorProfile.joins(department: :hospital)
                              .where(hospitals: {id: params[:id]})
                              .group("departments.specialization_id")
                              .count
    
    @departments = @hospital.departments
  end

  def show
    @specializations_with_counts = DoctorProfile
    .joins(department: :hospital)
    .where(hospitals: { id: @hospital.id })
    .group("departments.specialization_id")
    .count
  
    @specializations = Specialization.joins(:departments).where(departments: {hospital_id: @hospital.id})
  end
  
  def edit
    spec_ids = @hospital.departments.pluck(:specialization_id)
    @specializations = Specialization.where("id NOT IN (?)", spec_ids)
  end

  def doctors
    @doctors = DoctorProfile.eager_load(:doctor, {department: [:hospital, :specialization]}).where(hospitals: {id: params[:id]})
  end

  def add_hospital
    @foo= "Hello world"
  end

  def search
    @hospitals = Hospital.where("name ILIKE ?", "#{params[:query]}%").paginate(pagination(20))
    render template: "hospitals/index"
  end
  
  private
  
  def get_hospital
    @hospital = Hospital.find(params[:id])
  end
  
end