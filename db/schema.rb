# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_08_26_115643) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.string "address_line_1"
    t.string "address_line_2"
    t.string "state"
    t.string "city"
    t.string "country"
    t.string "postal_code"
    t.string "long"
    t.string "lat"
    t.string "landmark"
    t.text "description"
    t.integer "type", default: 0
    t.string "addressable_type"
    t.bigint "addressable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["addressable_type", "addressable_id"], name: "index_addresses_on_addressable"
  end

  create_table "admins", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "hospital_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["hospital_id"], name: "index_admins_on_hospital_id"
    t.index ["user_id"], name: "index_admins_on_user_id"
  end

  create_table "appointment_slots", force: :cascade do |t|
    t.bigint "working_day_id"
    t.integer "slot_number"
    t.time "start_at"
    t.time "end_at"
    t.integer "status"
    t.decimal "price", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["working_day_id"], name: "index_appointment_slots_on_working_day_id"
  end

  create_table "appointments", force: :cascade do |t|
    t.bigint "patient_id", null: false
    t.date "date"
    t.integer "status", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["patient_id"], name: "index_appointments_on_patient_id"
    t.index ["status"], name: "index_appointments_on_status"
  end

  create_table "chat_rooms", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "doctor_id"
    t.bigint "patient_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["doctor_id"], name: "index_chat_rooms_on_doctor_id"
    t.index ["patient_id"], name: "index_chat_rooms_on_patient_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.string "email"
    t.string "number"
    t.integer "type", default: 0
    t.string "contactable_type"
    t.bigint "contactable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contactable_type", "contactable_id"], name: "index_contacts_on_contactable"
  end

  create_table "departments", force: :cascade do |t|
    t.bigint "hospital_id"
    t.bigint "specialty_id"
    t.bigint "doctor_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["doctor_id"], name: "index_departments_on_doctor_id"
    t.index ["hospital_id"], name: "index_departments_on_hospital_id"
    t.index ["specialty_id"], name: "index_departments_on_specialty_id"
  end

  create_table "doctors", force: :cascade do |t|
    t.string "name"
    t.string "rank"
    t.integer "experience_time", comment: "in years"
    t.string "license_number"
    t.integer "gender", default: 2
    t.text "bio"
    t.bigint "speciality_id"
    t.integer "state"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["speciality_id"], name: "index_doctors_on_speciality_id"
  end

  create_table "hospitals", force: :cascade do |t|
    t.string "name"
    t.date "date_of_registration"
    t.integer "working_hours"
    t.string "license_number"
    t.string "ceo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "messages", force: :cascade do |t|
    t.uuid "chat_room_id"
    t.bigint "sender_id"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chat_room_id"], name: "index_messages_on_chat_room_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "patient_histories", force: :cascade do |t|
    t.bigint "patient_id"
    t.string "disease_name"
    t.boolean "is_genetic", default: false
    t.text "symptoms"
    t.text "precautions"
    t.integer "severity"
    t.integer "durations", default: 0, comment: "time of disease in months"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["patient_id"], name: "index_patient_histories_on_patient_id"
  end

  create_table "patients", force: :cascade do |t|
    t.bigint "user_id"
    t.string "full_name"
    t.string "identifier"
    t.date "date_of_birth"
    t.integer "gender", default: 2
    t.string "blood_type"
    t.text "allergies"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_patients_on_user_id"
  end

  create_table "payments", force: :cascade do |t|
    t.bigint "appointment_id"
    t.decimal "paid_amount", precision: 6, scale: 2
    t.decimal "refund_amount", precision: 6, scale: 2
    t.integer "status", default: 0
    t.string "via"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["appointment_id"], name: "index_payments_on_appointment_id"
    t.index ["status"], name: "index_payments_on_status"
  end

  create_table "profiles", force: :cascade do |t|
    t.bigint "user_id"
    t.string "first_name"
    t.string "middle_name"
    t.string "last_name"
    t.date "date_of_birth"
    t.integer "gender"
    t.text "bio"
    t.integer "occupation"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "qualifications", force: :cascade do |t|
    t.bigint "doctor_id"
    t.string "institution_name"
    t.string "course_name"
    t.date "start_at"
    t.date "end_at"
    t.integer "marks_got"
    t.integer "total_marks"
    t.string "course_abbr"
    t.string "city"
    t.string "state"
    t.string "country"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["doctor_id"], name: "index_qualifications_on_doctor_id"
  end

  create_table "specialties", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "treatments", force: :cascade do |t|
    t.bigint "patient_history_id"
    t.string "treatment_type"
    t.date "started_at"
    t.date "ended_at"
    t.string "note"
    t.text "side_effects"
    t.string "adminstrated_by"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["patient_history_id"], name: "index_treatments_on_patient_history_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "username"
    t.integer "state", default: 0
    t.integer "role", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "working_days", force: :cascade do |t|
    t.bigint "doctor_id", null: false
    t.string "day"
    t.time "shift_start"
    t.time "shift_end"
    t.boolean "working", default: true
    t.integer "slot_timing"
    t.time "break_time_start"
    t.time "break_time_end"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["doctor_id"], name: "index_working_days_on_doctor_id"
  end

  add_foreign_key "appointments", "patients"
  add_foreign_key "departments", "hospitals"
  add_foreign_key "departments", "specialties"
  add_foreign_key "messages", "chat_rooms"
  add_foreign_key "messages", "users", column: "sender_id"
  add_foreign_key "profiles", "users"
  add_foreign_key "working_days", "doctors"
end
