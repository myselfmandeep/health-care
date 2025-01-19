class ChatsController < ApplicationController
  before_action :authenticate_user!
  set_user_access :is_support_user?, except: %i[index]
  # skip_before_action :is_support_user?, only: %i[index]

  def index
    sql = <<~SQL
      SELECT c_p.*, \n
       users.full_name AS participant_name \n
      FROM chat_participants AS c_p \n
      INNER JOIN users AS users ON c_p.participant_id = users.id \n
      INNER JOIN chats AS chats ON chats.id = c_p.chat_id \n
      INNER JOIN chat_participants AS participants ON participants.chat_id = c_p.chat_id \n
      WHERE participants.participant_id = #{current_id} \n
        AND c_p.participant_id != #{current_id} \n
      ORDER BY chats.last_message_received_at DESC \n
    SQL

    @participants = ChatParticipant.find_by_sql(sql)
  end

  def edit
  end

  def edit
  end

  def update
  end
end
