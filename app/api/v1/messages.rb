module V1
  class Messages < Grape::API
    resource :messages do
      desc "requires chat id"
      params do
        requires :chat_id, type: String, desc: "Chat ID"
      end
      before do
        authenticate!
        @chat = Chat.find(params[:chat_id])
      end

      desc "get the list of messages for particular chat"
      get do
        chat_participant =  @chat.participants.where(participant_id: current_user.id)
        is_action_allowed!(@chat.participants.exists?(participant_id: current_user.id))

        messages = Message.get_messages(@chat, current_user.id).paginate(pagination(20))
        present messages, with: V1::Entities::Messages
      end

      desc "create message for chat room"
      params do
        requires :body, type: String, desc: "body of message"
      end
      post do
        @participants = @chat.participants
        @participant = @participants.find_by(participant: current_user)

        is_action_allowed!(@participant.present?)
        msg = @participant.messages.new(body: params[:body])
        if msg.save
          @chat.update(last_message_received_at: msg.created_at)
          msg_response = V1::Entities::Messages.represent(msg).as_json
          ActionCable.server.broadcast("chat_#{@chat.id}",
            { message: msg_response }
          )

          receiver = @participants.where.not(participant: current_user).pluck(:participant_id)

          receiver.each do |receiver_id|
            Broadcast.transmit("notification_#{receiver_id}", msg_response.merge({
              type: "new_message"
            }))
          end

          status 201
        else
          error_response!([ "Failed to send message", msg.full_error_messages ], 422)
        end
      end
    end
  end
end
