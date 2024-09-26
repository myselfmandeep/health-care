class NotificationChannel < ApplicationCable::Channel

  def subscribed
    stream_from(target)
  end

  def unsubscribed
  end

  def receive(data)
  end

  private

  def target
    "notification_#{params[:user_id]}"
  end
  
end