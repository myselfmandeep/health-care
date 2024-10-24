class CreateLikeDislike < ActiveRecord::Migration[7.2]
  def change
    create_table :votes do |t|
      t.bigint :voteable_id
      t.string :voteable_type
      t.integer :reaction, default: 0
      t.references :user

      t.timestamps
    end

    add_index :votes, [ :voteable_id, :voteable_type ]
  end
end
