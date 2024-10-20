class Invitation < ApplicationRecord

  EXPIRE_AFTER = 2.hours
  
  belongs_to :referrer, class_name: "User"
  belongs_to :recipient, class_name: "User", optional: true
  
  enum invitee_role:  [:patient, :doctor, :admin, :super_admin, :support]
  enum status: %i[sent accepted revoked registered expired]

  validates :email, 
            presence: true,
            # uniqueness: { message: "already has an invite" },
            format: { with: /\A[^@]+@[^@]+\.[^@]+\z/, message: "doesn't have valid format" }
  # validate :custom_validations, on: :create
  
  after_initialize -> {
    self.invite_code ||= SecureRandom.hex(20)
    self.status ||= :sent
    self.valid_till ||= Time.now + EXPIRE_AFTER
  }
  
  def is_valid_invitation?
    valid_till > Time.now
  end
  
  def build_support_user(**opts)
    send(:build_recipient, { role: :support }.merge(opts))
  end

  private

  # def custom_validations
  #   if User.find_by(email: email)
  #     errors.add(:base, "Email already assosiated with registered user")
  #   end
  # end
  
  
end
