class Hospital < ApplicationRecord

  has_many :departments
  has_many :specializations, through: :departments
  has_many :doctor_profiles, through: :departments

  validates :name, presence: true, uniqueness: true, length: { minimum: 8, maximum: 50 }, format: /\A[a-zA-Z\s]+\z/

end