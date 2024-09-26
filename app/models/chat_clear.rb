class ChatClear < ApplicationRecord
  
  belongs_to :chat
  belongs_to :message, optional: true
  belongs_to :cleared_by, class_name: "User"

  default_scope -> { order(created_at: :desc) }
  
end