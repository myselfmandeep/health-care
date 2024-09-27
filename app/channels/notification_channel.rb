class NotificationChannel < ApplicationCable::Channel

  def subscribed
    stream_from(target)
  end

  def unsubscribed
    stop_stream_for(target)
  end

  def close_connection(data)
    Broadcast.transmit(target, data.merge!({type: "user_sign_out"}))
    # binding.pry
  end
  
  def receive(data)
  end

  private

  def target
    "notification_#{params[:user_id]}"
  end
  
end