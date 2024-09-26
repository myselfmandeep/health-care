class AddLastMessageReceivedAtToChats < ActiveRecord::Migration[7.2]
  def change
    add_column :chats, :last_message_received_at, :datetime
  end
end
