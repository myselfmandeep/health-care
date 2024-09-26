class AddSymptomsAndMedicalHistoryToAppointments < ActiveRecord::Migration[7.2]
  def change
    add_column :appointments, :medical_history, :string, default: "N/A"
    add_column :appointments, :symptoms, :string, default: "N/A"
  end
end
