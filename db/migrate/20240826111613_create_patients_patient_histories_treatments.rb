class CreatePatientsPatientHistoriesTreatments < ActiveRecord::Migration[7.2]
  def change

    create_table :patients do |t|
      t.references :user
      t.string :full_name
      t.string :identifier
      t.date :date_of_birth
      t.integer :gender, default: 2
      t.string :blood_type
      t.text :allergies
      
      t.timestamps
    end

    create_table :patient_histories do |t|
      t.references :patient
      t.string :disease_name
      t.boolean :is_genetic, default: false
      t.text :symptoms
      t.text :precautions
      t.integer :severity
      t.integer :durations, default: 0, comment: "time of disease in months"
      
      t.timestamps
    end

    create_table :treatments do |t|
      t.references :patient_history
      t.string :treatment_type
      t.date :started_at
      t.date :ended_at
      t.string :note
      t.text :side_effects
      t.string :adminstrated_by
      
      t.timestamps
    end

  end
end
