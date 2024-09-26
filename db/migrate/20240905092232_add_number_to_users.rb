class AddNumberToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :contact, :string
  end
end
