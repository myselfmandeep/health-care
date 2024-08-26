class CreateProfilesAddressesContacts < ActiveRecord::Migration[7.2]
  def change
    create_table :profiles do |t|
      t.references :user, foreign_key: true
      t.string :first_name
      t.string :middle_name
      t.string :last_name
      t.date :date_of_birth
      t.integer :gender
      t.text    :bio
      t.integer :occupation
      
      t.timestamps
    end

    create_table :addresses do |t|
      t.string :address_line_1
      t.string :address_line_2
      t.string :state
      t.string :city
      t.string :country
      t.string :postal_code
      t.string :long
      t.string :lat
      t.string :landmark
      t.text   :description
      t.integer :type, default: 0
      t.references :addressable, polymorphic: true
      
      t.timestamps
    end

    create_table :contacts do |t|
      t.string :email
      t.string :number
      t.integer :type, default: 0
      t.references :contactable, polymorphic: true
      
      t.timestamps
    end
  end
end
