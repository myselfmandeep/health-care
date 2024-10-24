module V1
  module Entities
    class Chats < Base
      expose :id
      expose :messages, using: Messages do |chat, _options|
        Message.get_messages(chat, _options[:current_user]).paginate({ page: 1, per_page: 20 })
      end
    end
  end
end
