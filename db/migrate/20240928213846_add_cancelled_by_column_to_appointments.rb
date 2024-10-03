class AddCancelledByColumnToAppointments < ActiveRecord::Migration[7.2]
  def change
    add_column :appointments, :cancelled_by, :integer
  end
end
