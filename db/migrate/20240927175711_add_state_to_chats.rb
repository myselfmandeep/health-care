class AddStateToChats < ActiveRecord::Migration[7.2]
  def change
    add_column :chats, :state, :integer, default: 0
  end
end
