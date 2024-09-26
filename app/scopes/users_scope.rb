class UsersScope < ApplicationScope
  
  def list
    roles_we_have = User.roles
    role = user.get_role
    visible_roles = []
    
    visible_roles << roles_we_have[:super_admin]
    visible_roles << roles_we_have[:doctor] if user.patient? || user.super_admin?
    visible_roles << roles_we_have[:patient] if user.doctor? || user.super_admin?
    
    users = User.where("id != ? AND role IN (?)", user.id, visible_roles)

    return users if user.super_admin?
    
    user_ids =  if user.patient?
                  users.where(id: doctor_ids)
                elsif user.doctor?
                  users.where(id: patient_ids)
                end        

    users = users.where("id IN (?)", admin_ids + user_ids)
  end

  def patient_ids
    Appointment.where(doctor_id: user.id).pluck(:patient_id)
  end

  def doctor_ids
    Appointment.where(patient_id: user.id).pluck(:doctor_id)
  end

  def admin_ids
    User.where(role: [:super_admin, :admin]).pluck(:id)
  end
  
end