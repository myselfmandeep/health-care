class ChatChannel < ApplicationCable::Channel

  def subscribed
    stream_from(unique_identifier)
  end

  def unsubscribed
    stop_stream_for(unique_identifier)
  end

  def receive(data)
    ActionCable.server.broadcast(unique_identifier, data)
  end

  private

  def unique_identifier
    "chat_#{params[:chat_id]}"
  end
  
end