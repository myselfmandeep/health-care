class CreateAppointmentsPayments < ActiveRecord::Migration[7.2]
  def change

    create_table :appointments do |t|
      t.references :patient, null: false, foreign_key: true
      t.date :date
      t.integer :status, default: 0
      
      t.timestamps
    end

    create_table :payments do |t|
      t.references :appointment
      t.decimal :paid_amount, precision: 6, scale: 2
      t.decimal :refund_amount, precision: 6, scale: 2
      t.integer :status, default: 0
      t.string :via
      
      t.timestamps
    end

    add_index :appointments, :status
    add_index :payments, :status
  end
end
