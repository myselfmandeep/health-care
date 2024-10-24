# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(full_name: genre_name)
#   end

# ADD USERS
users = [
  { full_name: "John Doe",    password: "John@123", email: "johndoe@gmail.com", role: "super_admin", date_of_birth: "25-01-1997", gender: "male" },
  { full_name: "Sunil Kumar", password: "John@123", email: "sunil@gmail.com",   role: "doctor",      date_of_birth: "25-01-1997", gender: "male" },
  { full_name: "Rajeev",      password: "John@123", email: "rajeev@gmail.com",  role: "doctor",      date_of_birth: "25-01-1997", gender: "male" },
  { full_name: "Somaya",      password: "John@123", email: "somaya@gmail.com",  role: "patient",     date_of_birth: "25-01-1997", gender: "female" },
  { full_name: "Shankar",     password: "John@123", email: "shankar@gmail.com", role: "patient",     date_of_birth: "25-01-1997", gender: "male" }
].each { |user| User.create(user) }

# ADD SPECIALIZATIONS
specializations = [
  { name: "Allergy and Immunology" },
  { name: "Anesthesiology" },
  { name: "Cardiology" },
  { name: "Dermatology" },
  { name: "Emergency Medicine" },
  { name: "Endocrinology" },
  { name: "Gastroenterology" },
  { name: "Geriatrics" },
  { name: "Hematology" },
  { name: "Infectious Disease" },
  { name: "Internal Medicine" },
  { name: "Nephrology" },
  { name: "Neurology" },
  { name: "Obstetrics and Gynecology (OB/GYN)" },
  { name: "Oncology" },
  { name: "Ophthalmology" },
  { name: "Orthopedics" },
  { name: "Otolaryngology (ENT - Ear, , )" },
  { name: "Pathology" },
  { name: "Pediatrics" },
  { name: "Physical Medicine and Rehabilitation" },
  { name: "Plastic Surgery" },
  { name: "Psychiatry" },
  { name: "Pulmonology" },
  { name: "Radiology" },
  { name: "Rheumatology" },
  { name: "Surgery (General)" },
  { name: "Thoracic Surgery" },
  { name: "Urology" },
  { name: "Vascular Surgery" },
  { name: "Bariatric Surgery" },
  { name: "Breast Surgery" },
  { name: "Critical Care Medicine" },
  { name: "Dentistry" },
  { name: "Dermatologic Surgery" },
  { name: "Endoscopic Surgery" },
  { name: "Family Medicine" },
  { name: "General Practice" },
  { name: "Gynecologic Oncology" },
  { name: "Hand Surgery" },
  { name: "Hepatology" },
  { name: "Hospice and Palliative Medicine" },
  { name: "Infectious Disease" },
  { name: "Interventional Cardiology" },
  { name: "Neonatology" },
  { name: "Neurocritical Care" },
  { name: "Neurointerventional Surgery" },
  { name: "Neurological Surgery (Neurosurgery)" },
  { name: "Pain Management" },
  { name: "Gynecology" },
  { name: "Sleep Medicine" }
].each { |specialization| Specialization.create(specialization) }

# ADD HOSPITALS
hospitals = [
  { name: "PGI Hospital" },
  { name: "Shreeman Hospital" },
  { name: "Tagore Hospital" },
  { name: "Jammu Hospital" },
  { name: "Sacred Heart Hospital" },
  { name: "Civil Hospital" },
  { name: "Rattan Hospital" },
  { name: "AIIMS" },
  { name: "Apollo Hospitals" },
  { name: "Fortis Memorial Research Institute" },
  { name: "Christian Medical College (CMC)" },
  { name: "Max Super Specialty Hospital" },
  { name: "Kokilaben Dhirubhai Ambani Hospital" },
  { name: "Narayana Health" },
  { name: "Medanta - The Medicity" },
  { name: "Lilavati Hospital" },
  { name: "Jaslok Hospital" },
  { name: "Manipal Hospitals" },
  { name: "Artemis Hospital" },
  { name: "BLK Super Speciality Hospital" },
  { name: "Sir Ganga Ram Hospital" },
  { name: "Care Hospitals" },
  { name: "Ruby Hall Clinic" },
  { name: "Continental Hospitals" },
  { name: "Columbia Asia Hospital" },
  { name: "Aster Medcity" },
  { name: "Hinduja Hospital" },
  { name: "Max Super Speciality Hospital" },
  { name: "Alchemist Hospital" },
  { name: "Sri Guru Ram Das Institute of Medical Sciences and Research" },
  { name: "Ivy Hospital" },
  { name: "SevenHills Hospital" },
  { name: "Saifee Hospital" },
  { name: "KIMS Hospitals" },
  { name: "Yashoda Hospitals" },
  { name: "Bharti Hospital" }
  ].each { |hospital| Hospital.new(hospital).save }

# ADDING DEPARTMENTS
Hospital.all.each do |hospital|
  specializations = Specialization.ids
  specializations.each do |specialization|
    next if rand((1..100)).odd?
    Department.create(hospital_id: hospital.id, specialization_id: specialization)
  end
end

# ADDING DOCTORS
timings = [ [ "09:00", "12:00" ], [ "12:00", "03:00" ], [ "03:00", "06:00" ] ]
current_doctors = User.joins(:doctor_profile).ids
departments = Department.ids

User.doctor.each do |doc|
  time = timings.sample
  d = doc.build_doctor_profile({
    start_at: time.first,
    end_at: time.last,
    slot_duration: [ 15, 30 ].sample,
    experience_time: rand(5..25),
    highest_qualification: "MBBS",
    department_id: departments.sample
  })

  if d.save
    p "#{doc.full_name} registered as doctor"
  else
    p "#{doc.full_name}  failed to registered as doctor"
  end
end
