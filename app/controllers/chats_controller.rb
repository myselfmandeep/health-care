class ChatsController < ApplicationController
  before_action :authenticate_user!
  set_user_access :is_support_user?, except: %i[index]
  # skip_before_action :is_support_user?, only: %i[index]

  def index
    user_chats = Chat.joins(:chat_participants).where(chat_participants: { participant_id: current_id }).ids
    @participants = ChatParticipant.includes([ :chat, :participant, :messages ])
    .where("chat_id IN (?) AND participant_id != ?", user_chats, current_id)
    .order("chats.last_message_received_at DESC")
  end

  def edit
  end

  def edit
  end

  def update
  end
end
