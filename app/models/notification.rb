class Notification < ApplicationRecord
  belongs_to :user, optional: true

  # ===== CLASS METHODS =====

  class << self
    def notify_user(message:, user_id:, **opts)
      notification = create(content: message, user_id: user_id)
      identifier = "notification_#{user_id}"
      payload  = { message: message }.merge!(opts)

      # ActionCable.server.broadcast(identifier, payload)
      Broadcast.transmit(identifier, payload)
    end
  end
end
