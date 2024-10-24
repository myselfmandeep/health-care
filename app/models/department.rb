class Department < ApplicationRecord
  has_many :doctor_profiles
  belongs_to :hospital
  belongs_to :specialization
  belongs_to :head_of_department, class_name: "User", optional: true

  delegate :name, to: :specialization, prefix: true
  delegate :name, to: :hospital, prefix: true

  validates :specialization, uniqueness: { scope: :hospital, message: "already has been added to this hospital" }
end
