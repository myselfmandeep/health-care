module V1
  module Entities
    class Messages < Base
      expose :id
      expose :chat_id do |msg, _options|
        msg.sender.chat_id
      end

      expose :sender do |msg, _options|
        V1::Entities::Users.represent(msg.sender.participant, _options)
      end

      expose :body
      expose :sent_at do |msg, _options|
        msg.created_at.in_time_zone("Asia/Kolkata").strftime("%d-%m-%y %I:%M %p")
      end
    end
  end
end
