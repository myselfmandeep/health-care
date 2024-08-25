class User < ApplicationRecord
  
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum state: { pending: 0, active: 1, suspended: 2, removed: 3 }
  enum role:  { user: 0, admin: 1, super_admin: 2 }

end
