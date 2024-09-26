class CreateTableNotifications < ActiveRecord::Migration[7.2]
  def change
    create_table :notifications do |t|
      t.string :content
      t.references :user, foreign_key: true
      # t.references :use
      t.datetime  :created_at
      
    end
  end
end
