class CreateDoctorsQualificationsWorkingDaysAppointmentSlots < ActiveRecord::Migration[7.2]
  def change

    create_table :doctors do |t|
      t.string :name
      t.string :rank
      t.integer :experience_time, comment: "in years"
      t.string :license_number
      t.integer :gender, default: 2
      t.text :bio
      t.references :speciality
      t.integer :state
      
      t.timestamps
    end

    create_table :qualifications do |t|
      t.references :doctor
      t.string :institution_name
      t.string :course_name
      t.date :start_at
      t.date :end_at
      t.integer :marks_got
      t.integer :total_marks
      t.string :course_abbr
      t.string :city
      t.string :state
      t.string :country
      
      t.timestamps
    end

    create_table :working_days do |t|
      t.references :doctor, null: false, foreign_key: true
      t.string :day
      t.time :shift_start
      t.time :shift_end
      t.boolean :working, default: true
      t.integer :slot_timing
      t.time :break_time_start
      t.time :break_time_end
      
      t.timestamps
    end

    create_table :appointment_slots do |t|
      t.references :working_day
      t.integer :slot_number
      t.time :start_at
      t.time :end_at
      t.integer :status
      t.decimal :price, precision: 10, scale: 2
    
      t.timestamps
    end
    
  end
end
