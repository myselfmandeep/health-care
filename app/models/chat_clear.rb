class ChatClear < ApplicationRecord
  
  belongs_to :chat
  belongs_to :message, optional: true
  belongs_to :cleared_by, class_name: "User"

  validate :has_any_message
  
  default_scope -> { order(created_at: :desc) }
  
  private

  def has_any_message
    c_chat = chat.chat_clears.where(cleared_by_id: self.cleared_by_id)
    c_msgs = c_chat.try(:pluck, :message_id) || []
    last_clear = c_chat.where(message_id: nil).pluck(:created_at).max
    
    messages = chat.messages
    messages = messages.where("messages.created_at > ?", last_clear) if last_clear.present?
    messages = messages.where.not(id: c_msgs)
    errors.add(:base, "Chat has no messages to clear") unless messages.present?
  end

end