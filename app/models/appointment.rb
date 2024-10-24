class Appointment < ApplicationRecord
  belongs_to :doctor, class_name: "User"
  belongs_to :patient, class_name: "User"
  has_many :feedbacks

  delegate :full_name, to: :doctor, prefix: true
  delegate :full_name, to: :patient, prefix: true

  enum status: [ :requested, :confirmed, :rejected, :cancelled, :fulfilled ]
  enum cancelled_by: [ :doctor, :patient ]

  STATUS = self.statuses.freeze

  validates_presence_of :date, :timeslot
  validates :cancellation_reason, presence: true, if: ->(appt) { appt.cancelled? }
  validate :is_taken_slot, on: :create

  before_create -> { self.appt_code = SecureRandom.hex(10) }
  after_update :send_fulfill_mail, if: :saved_change_to_status?

  def patient_has_appointment_for_requested_date
    appointment = patient.appointment_on_specific_date(date).first
    return false unless appointment.present?
    status = appointment.status
    error_message = status == "confirmed" ? "You already have a confirmed appointment for requested date" : "You already have a pending appointment request for requested date"
    errors.add(:base, error_message)

    true
  end

  def has_appointment_for_same_time_slot
    appointment = patient.appointment_on_specific_date(date).where(timeslot: self.timeslot).try(:first)
    return false unless appointment.present?

    status = appointment.status
    error_message = status == "confirmed" ? "You already have a confirmed appointment for same timeslot on same day with other doctor" : "You already have a pending appointment request for same timeslot on same day with other doctor"
    errors.add(:base, error_message)
    true
  end

  def is_taken_slot
    return if has_appointment_for_same_time_slot
    appointments = Appointment.where("doctor_id = ? AND date = ? AND timeslot = ? AND status IN (?)", doctor_id, date, timeslot, [ STATUS[:requested], STATUS[:confirmed] ])

    if appointments.present?
      errors.add(:base, "Slot is already booked by someone")
    end
  end

  def send_fulfill_mail
    return unless fulfilled?

    AppointmentMailer.feedback_mail(self).deliver_now rescue false
  end
end
