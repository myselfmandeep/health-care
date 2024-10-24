class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    stream_from(unique_identifier)
  end

  def unsubscribed
    stop_stream_for(unique_identifier)
  end

  def receive(data)
    # binding.pry
    users_appearance = {}
    data["users"].each do |u_id|
      if Broadcast.transmit("notification_#{u_id}", { type: "ping" }) == 1
        users_appearance[u_id] = true
      else
        users_appearance[u_id] = false
      end
    end

    # binding.pry
    Broadcast.transmit(unique_identifier, users_appearance.as_json)
  end

  private

  def unique_identifier
    "appearance_#{params[:user_id]}"
  end
end
