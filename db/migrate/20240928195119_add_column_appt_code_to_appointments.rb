class AddColumnApptCodeToAppointments < ActiveRecord::Migration[7.2]
  def change
    add_column :appointments, :appt_code, :string
  end
end
