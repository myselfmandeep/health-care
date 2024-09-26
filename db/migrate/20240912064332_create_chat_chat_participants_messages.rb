class CreateChatChatParticipantsMessages < ActiveRecord::Migration[7.2]
  def change
    create_table :chats do |t|
      t.integer :chat_type, default: 0
      
      t.timestamps
    end

    create_table :chat_participants do |t|
      t.references :chat
      t.references :participant, null: true, foreign_key: { to_table: :users }
      
      t.timestamps
    end
    
    create_table :messages do |t|
      t.references :sender, foreign_key: {to_table: :chat_participants}
      t.text :body
      
      t.timestamps
    end
  end
end