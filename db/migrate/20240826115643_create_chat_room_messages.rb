class CreateChatRoomMessages < ActiveRecord::Migration[7.2]
  def change
    create_table :chat_rooms, id: :uuid do |t|
      t.references :doctor
      t.references :patient
      
      t.timestamps
    end

    create_table :messages do |t|
      t.references :chat_room, foreign_key: true, type: :uuid
      t.references :sender, foreign_key: { to_table: :users }
      t.text :content

      t.timestamps
    end
  end
end
