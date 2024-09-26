class Chat < ApplicationRecord

  enum chat_type: %i[personal group], _suffix: :chats 
  
  has_many :chat_participants, dependent: :nullify
  has_many :messages, through: :chat_participants
  has_many :chat_clears

  alias :participants :chat_participants

  after_initialize -> {self.last_message_received_at = Time.now}
  
  class << self
    def one_to_one_chat(users=[])
      chat = Chat.joins(:chat_participants)
              .where(chat_participants: { participant_id: users})
              .group("chats.id")
              .having("COUNT(chat_participants.id) = 2")
              .try(:first)

      unless chat.present?
        chat = new()
        users.each {|id| chat.participants.new(participant_id: id)}
      else 
        chat = Chat.includes(messages: [{sender: :participant}]).find_by(id: chat.id)
      end
      
      chat
    end
  end

end