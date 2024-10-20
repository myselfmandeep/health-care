class CreateInvitations < ActiveRecord::Migration[7.2]
  def change
    create_table :invitations do |t|
      t.string :email
      t.datetime :valid_till
      t.integer :status, default: 0
      t.string :invite_code
      t.integer :invitee_role
      t.references :recipient, null: true, foreign_key: { to_table: :users }
      t.references :referrer, null: false, foreign_key: { to_table: :users }
      
      t.timestamps
    end
  end
end
