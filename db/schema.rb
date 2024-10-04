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

ActiveRecord::Schema[7.2].define(version: 2024_10_03_083228) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "appointments", force: :cascade do |t|
    t.bigint "doctor_id", null: false
    t.bigint "patient_id", null: false
    t.string "timeslot"
    t.date "date"
    t.integer "status", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "medical_history", default: "N/A"
    t.string "symptoms", default: "N/A"
    t.datetime "cancelled_at"
    t.string "cancellation_reason"
    t.string "appt_code"
    t.integer "cancelled_by"
    t.index ["doctor_id"], name: "index_appointments_on_doctor_id"
    t.index ["patient_id"], name: "index_appointments_on_patient_id"
  end

  create_table "chat_clears", force: :cascade do |t|
    t.bigint "chat_id"
    t.bigint "cleared_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "message_id"
    t.index ["chat_id"], name: "index_chat_clears_on_chat_id"
    t.index ["cleared_by_id"], name: "index_chat_clears_on_cleared_by_id"
    t.index ["message_id"], name: "index_chat_clears_on_message_id"
  end

  create_table "chat_participants", force: :cascade do |t|
    t.bigint "chat_id"
    t.bigint "participant_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chat_id"], name: "index_chat_participants_on_chat_id"
    t.index ["participant_id"], name: "index_chat_participants_on_participant_id"
  end

  create_table "chats", force: :cascade do |t|
    t.integer "chat_type", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "last_message_received_at"
    t.integer "state", default: 0
  end

  create_table "departments", force: :cascade do |t|
    t.bigint "hospital_id", null: false
    t.bigint "specialization_id", null: false
    t.bigint "head_of_department_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["head_of_department_id"], name: "index_departments_on_head_of_department_id"
    t.index ["hospital_id"], name: "index_departments_on_hospital_id"
    t.index ["specialization_id"], name: "index_departments_on_specialization_id"
  end

  create_table "doctor_profiles", force: :cascade do |t|
    t.bigint "doctor_id", null: false
    t.bigint "department_id", null: false
    t.string "start_at"
    t.string "end_at"
    t.json "schedule"
    t.integer "slot_duration", comment: "In minutes"
    t.integer "experience_time", comment: "in years"
    t.string "highest_qualification"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["department_id"], name: "index_doctor_profiles_on_department_id"
    t.index ["doctor_id"], name: "index_doctor_profiles_on_doctor_id"
  end

  create_table "feedbacks", force: :cascade do |t|
    t.text "body"
    t.bigint "appointment_id"
    t.bigint "user_id"
    t.bigint "parent_feedback_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["appointment_id"], name: "index_feedbacks_on_appointment_id"
    t.index ["parent_feedback_id"], name: "index_feedbacks_on_parent_feedback_id"
    t.index ["user_id"], name: "index_feedbacks_on_user_id"
  end

  create_table "hospitals", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "messages", force: :cascade do |t|
    t.bigint "sender_id"
    t.text "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.string "content"
    t.bigint "user_id"
    t.datetime "created_at"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "specializations", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "full_name"
    t.string "username"
    t.date "date_of_birth"
    t.integer "gender"
    t.integer "state", default: 0
    t.integer "role", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "contact"
    t.string "uid"
    t.string "provider"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "votes", force: :cascade do |t|
    t.bigint "voteable_id"
    t.string "voteable_type"
    t.integer "reaction", default: 0
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_votes_on_user_id"
    t.index ["voteable_id", "voteable_type"], name: "index_votes_on_voteable_id_and_voteable_type"
  end

  add_foreign_key "appointments", "users", column: "doctor_id"
  add_foreign_key "appointments", "users", column: "patient_id"
  add_foreign_key "chat_clears", "messages"
  add_foreign_key "chat_clears", "users", column: "cleared_by_id"
  add_foreign_key "chat_participants", "users", column: "participant_id"
  add_foreign_key "departments", "users", column: "head_of_department_id"
  add_foreign_key "doctor_profiles", "users", column: "doctor_id"
  add_foreign_key "feedbacks", "feedbacks", column: "parent_feedback_id"
  add_foreign_key "messages", "chat_participants", column: "sender_id"
  add_foreign_key "notifications", "users"
end
