class Specialization < ApplicationRecord
  has_many :departments
  has_many :hospitals, through: :departments
  has_many :doctor_profiles, through: :departments

  validates :name, presence: true, uniqueness: true, length: { minimum: 8, maximum: 35 }
end
