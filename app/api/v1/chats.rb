module V1
  class Chats < Grape::API
    resource :chats do
      params do
        requires :user_id, type: Integer, desc: "User Id"
      end
      post "/create_chat" do
        chat = Chat.one_to_one_chat([ params[:user_id], current_user.id ])

        # binding.pry

        if chat.save
          present chat, with: V1::Entities::Chats, current_user: current_user.id
        else
          error_response!(chat.full_error_messages, 422)
        end
      end

      namespace ":id" do
        params do
          requires :id, as: :chat_id, type: Integer, desc: "Chat ID"
        end

        params do
          requires :cleared_by, as: :cleared_by_id, type: Integer, desc: "Creater of message"
          optional :message_id, type: Integer, desc: "Message Id"
        end
        delete "/clear_chat" do
          chat_cleard = ChatClear.new(declared(params, include_missing: false))

          if chat_cleard.save
            success_response!({ message: "Chat has been cleared", chat_id: params[:id] })
          else
            error_response!(chat_cleard.full_error_messages)
          end
        end
      end
    end
  end
end
