class ChatParticipant < ApplicationRecord
  belongs_to :chat
  belongs_to :participant, class_name: "User", optional: true
  has_many :chat_clears

  delegate :full_name, to: :participant, prefix: true

  validates :participant, uniqueness: { scope: :chat }
  # , if: -> (c_p) { c_p.persisted? }

  has_many :messages, class_name: "Message", foreign_key: :sender_id
end
