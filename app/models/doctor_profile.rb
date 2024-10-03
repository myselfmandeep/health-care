class DoctorProfile < ApplicationRecord

  # ===== ASSOSIATIONS =====
  belongs_to :doctor, class_name: "User", optional: true
  belongs_to :department
  has_many :votes, as: :voteable
  has_many :voters, through: :votes, source: :user
  
  # ===== DELEGATIONS =====
  delegate :full_name, to: :doctor, prefix: true
  
  # ===== CONSTANTS =====
  VALID_SLOTS = [15, 30].freeze
  
  # ===== VALIDATIONS =====
  validates_presence_of :start_at, :end_at, :slot_duration, :experience_time, :highest_qualification
  validate :custom_validations
  
  # ===== SCOPES =====
  
  # ===== PUBLIC METHODS =====
  def custom_validations
    valid_start_at = is_valid_time?(start_at)
    valid_end_at = is_valid_time?(end_at) 

    errors.add(:experience_time, "has invalid value") unless experience_time > 0 || experience_time < 100
    errors.add(:start_at, "has Invalid time format") unless valid_start_at
    errors.add(:end_at, "has Invalid time format") unless valid_end_at
    errors.add(:slot_duration, "has Invalid value valid solts e.g #{VALID_SLOTS.join(", ")}") unless VALID_SLOTS.include?(slot_duration)
    # errors.add(:base, "must have a doctor role") unless doctor.try(:doctor?) 
    
    if valid_start_at && valid_end_at 
      errors.add(:base, "Start time must be less than end time") unless Time.parse(start_at) < Time.parse(end_at)
    end
  end

  def bio
    <<-BIO 
      Dr. #{doctor_full_name} is a highly experienced medical professional with 16 years of hands-on experience in their field.
      They hold the prestigious qualification of MBBS and are known for their dedication to providing top-notch healthcare services.
      Dr. #{doctor_full_name} currently practices in the #{department.specialization_name} department, offering consultations from #{start_at} to #{end_at}.
      They ensure focused attention during appointments, with each consultation slot lasting #{slot_duration} minutes, allowing ample time to address patient concerns thoroughly.
    BIO
  end

  def like_dislikes
    v = votes.group(:reaction).count
    {likes: (v["like"] || 0), dislikes: (v["dislike"] || 0)}.with_indifferent_access
  end

  private

  def is_valid_time?(time)
    !!Time.parse(time)
  rescue
    false
  end
  
end