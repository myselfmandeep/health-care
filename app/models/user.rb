class User < ApplicationRecord
  # ===== EXTENTSIONS =====
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable

  # ===== ENUMS =====
  enum state: { active: 0, suspended: 1, removed: 2 }
  enum role:  [ :patient, :doctor, :admin, :super_admin, :support ]
  enum gender: { male: 0, female: 1, other: 2 }

  # ===== CONSTANTS =====
  GENDERS = self.genders.keys.freeze
  ROLES = self.roles.keys.freeze
  STATES = self.states.keys.freeze

  # ===== ASSOSIATIONS =====
  has_many :doctor_appointments, class_name: "Appointment", foreign_key: :doctor_id
  has_many :patient_appointments, class_name: "Appointment", foreign_key: :patient_id
  has_one  :doctor_profile, class_name: "DoctorProfile", foreign_key: :doctor_id
  has_many :notifications, dependent: :nullify
  has_many :chat_participants, class_name: "ChatParticipant", foreign_key: :participant_id
  has_many :chat_clears, class_name: "ChatClear", foreign_key: :cleared_by
  # has_many :messages, class_name: "Message", foreign_key: "sender_id"
  has_many :chats, through: :chat_participants
  has_many :doc_feedbacks, through: :doctor_appointments, source: :feedbacks
  has_one :recipient, class_name: "Invitation", foreign_key: :recipient_id, dependent: :nullify
  has_many :referrers, class_name: "Invitation", foreign_key: :referrer_id, dependent: :nullify

  accepts_nested_attributes_for :doctor_profile

  # ===== VALIDATIONS =====
  # validates :email, presence: true, uniqueness: true, format: { with: /\A[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\z/ }
  validates :email, presence: true, uniqueness: true
  validates :full_name, length: { minimum: 3, maximum: 25 }, unless: :reset_password_period_valid?
  validates :contact, length: { is: 10 }, format: { with: /\A\d+\z/, message: "must be a number" }, if: -> { contact.present? }
  validates :gender, presence: { message: "is required" }, unless: :reset_password_period_valid?
  validates :date_of_birth, comparison: { less_than: Date.tomorrow, message: "can't be greater than today" }, if: -> { date_of_birth.present? && !reset_password_period_valid? }
  validates :username, length: { minimum: 3, maximum: 25 }, if: -> { username.present? }
  validates :password,
                       format: {
                        with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}\z/,
                        message: "is weak. Please choose a strong password. e.g john@Doe1"
                      }, if: :encrypted_password_changed?

  # ===== SCOPES =====
  # default_scope { where.not(state: [:suspended, :removed]) }

  # ===== CALLBACKS =====
  after_update :after_suspend, if: :saved_change_to_state?

  # ===== PUBLIC METHODS =====

  def after_suspend
    if suspended? || removed?
      appointments.each do |appointment|
        appointment.update(status: :cancelled, cancellation_reason: "Unfortunately we regret that your appointments has been marked cancelled due to account status has been chnaged to #{self.state}")
      end

      dr_ids = appointments.pluck(:doctor_id).try(:uniq) || []
      patient_ids = appointments.pluck(:patient_id).try(:uniq) || []

      if doctor?
        patient_ids.each do |p_id|
          Notification.notify_user(message: "Dr #{self.full_name} is no longer available. Due to that your all appointments has been marked cancelled", user_id: p_id)
        end
      elsif patient?
        dr_ids.each do |d_id|
          Notification.notify_user(message: "Patient #{self.full_name} is no longer available. Due to that it's all appointments has been marked cancelled", user_id: d_id)
        end
      else
        Notification.notify_user(message: "you account has been marked #{self.state}. Please contact the administrator", user_id: self.id)
      end
    end
  end

  def appointments
    case role
    when "patient"
      patient_appointments
    when "doctor"
      doctor_appointments
    when "support"
      Appointment.none
    else
      []
    end
  end

  def appointment_on_specific_date(date)
    status = Appointment.statuses
    denied_status = [ status[:rejected], status[:cancelled] ]

    appointments.where("date = :date AND status NOT IN (:denied)", { date: date, denied: denied_status })
  end

  def get_role
    User.roles[self.role]
  end

  # ===== CLASS METHODS =====

  class << self
    def vote_for(resource, user = nil)
      return false unless user

      votes = resource.votes
      vote = votes.find_by(user: user.id)
      return false unless vote

      vote.like? ? "liked" : "disliked"
    end

    def create_user_without_validation(**opts)
      user = User.new(**opts)

      if user.save(validate: false)
        [ user, nil ]
      end
    rescue ActiveRecord::RecordNotUnique
      [ false, "Email already has been taken" ]
    end

    # def downvote_for(resource, user=nil)
    #   return false unless user

    #   votes = resource.votes
    #   vote = votes.find_by(user: user.id)
    #   return false unless vote

    #   vote.is_liked?
    # end
  end
end
