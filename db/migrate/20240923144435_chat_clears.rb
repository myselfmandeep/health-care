class ChatClears < ActiveRecord::Migration[7.2]
  def change
    create_table :chat_clears do |t|
      t.references :chat
      t.references :cleared_by, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
