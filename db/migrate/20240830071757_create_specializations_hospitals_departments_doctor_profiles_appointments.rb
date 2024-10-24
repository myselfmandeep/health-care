class CreateSpecializationsHospitalsDepartmentsDoctorProfilesAppointments < ActiveRecord::Migration[7.2]
  def change
    create_table :hospitals do |t|
      t.string :name

      t.timestamps
    end

    create_table :specializations do |t|
      t.string :name

      t.timestamps
    end

    create_table :departments do |t|
      t.references :hospital, null: false
      t.references :specialization, null: false
      t.references :head_of_department, null: true, foreign_key: { to_table: :users }

      t.timestamps
    end

    create_table :doctor_profiles do |t|
      t.references :doctor, null: false, foreign_key: { to_table: :users }
      t.references :department, null: false
      t.string :start_at
      t.string :end_at
      t.json :schedule
      t.integer :slot_duration,   comment: "In minutes"
      t.integer :experience_time, comment: "in years"
      t.string :highest_qualification

      t.timestamps
    end

    create_table :appointments do |t|
      t.references :doctor, null: false, foreign_key: { to_table: :users }
      t.references :patient, null: false, foreign_key: { to_table: :users }
      t.string     :timeslot
      t.date       :date
      t.integer    :status, default: 0

      t.timestamps
    end
  end
end
