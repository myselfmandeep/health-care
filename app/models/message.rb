class Message < ApplicationRecord

  belongs_to :sender, class_name: "ChatParticipant"

  validates :body, presence: true

  default_scope -> { order(created_at: :desc) }

  def self.get_messages(chat, user_id)
    messages = Message.includes(sender: :participant).where(chat_participants: {chat_id: chat.id})
    chat_clears_by_user = chat.chat_clears.where(cleared_by_id: user_id)
    
    cleared_at =  chat_clears_by_user.where(message_id: nil).pluck(:created_at).max
    
    if cleared_at.present?
      messages = messages.where("messages.created_at > ?", cleared_at)
    end
    cleared_messages = chat_clears_by_user.where.not(message_id: nil).pluck(:message_id)
    
    # messages.where("messages.id NOT IN (?)", cleared_messages) # not working with [] array
    messages.where.not(id: cleared_messages)
  end
  
end