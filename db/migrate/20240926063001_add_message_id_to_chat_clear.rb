class AddMessageIdToChatClear < ActiveRecord::Migration[7.2]
  def change
    add_reference :chat_clears, :message, foreign_key: true, null: true
  end
end
