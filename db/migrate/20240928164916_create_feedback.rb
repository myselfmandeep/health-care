class CreateFeedback < ActiveRecord::Migration[7.2]
  def change
    create_table :feedbacks do |t|
      t.text :body
      t.references :appointment
      t.references :user
      t.references :parent_feedback, foreign_key: {to_table: :feedbacks}
      
      t.timestamps
    end
  end
end
