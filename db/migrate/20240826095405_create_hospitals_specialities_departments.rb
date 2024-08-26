class CreateHospitalsSpecialitiesDepartments < ActiveRecord::Migration[7.2]
  def change
    create_table :hospitals do |t|
      t.string :name
      t.date :date_of_registration
      t.integer :working_hours
      t.string :license_number
      t.string :ceo
      
      t.timestamps
    end

    create_table :specialties do |t|
      t.string :title
      t.text :description
      
      t.timestamps
    end

    create_table :departments do |t|
      t.references :hospital, null: :false, foreign_key: true
      t.references :specialty, null: :false, foreign_key: true
      t.references :doctor, null: true
      
      t.timestamps
    end

    create_table :admins do |t|
      t.references :user
      t.references :hospital

      t.timestamps
    end
  end
end
