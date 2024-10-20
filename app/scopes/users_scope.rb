class UsersScope < ApplicationScope
  
  def list
    roles_we_have = User.roles
    role = user.get_role
    visible_roles = []
    
    visible_roles << roles_we_have[:super_admin]
    # visible_roles << roles_we_have[:doctor] if user.patient? || user.super_admin?
    visible_roles << roles_we_have[:doctor] unless user.doctor?
    visible_roles << roles_we_have[:patient] unless user.patient?
    visible_roles << roles_we_have[:support] unless user.support?
    # visible_roles << roles_we_have[:patient] if user.doctor? || user.super_admin?
    
    users = User.where("id != ? AND role IN (?)", user.id, visible_roles)

    return users if user.super_admin?
    
    # user_ids =  if user.patient?
    #               # users.where(id: doctor_ids)
    #               users.where("id IN (?) OR role = ?", doctor_ids, roles_we_have[:support])
    #             elsif user.doctor?
    #               # users.where(id: patient_ids)
    #               users.where("id IN (?) OR role = ?", patient_ids, roles_we_have[:support])
    #             elsif user.support?
    #               support_user_scope
    #             end        
    user_ids = scope

    users = users.where("id IN (?)", admin_ids + user_ids)
  end

  def scope
    return Appointment.where(doctor_id: user.id).pluck(:patient_id) if patient?

    return Appointment.where(patient_id: user.id).pluck(:doctor_id) if doctor?
    
    return ChatParticipant.where("chat_id IN (?) AND participant_id != ?", user.chats.ids, user.id).pluck(:participant_id) if support?

    []
  end
  
  # def patient_ids
  #   Appointment.where(doctor_id: user.id).pluck(:patient_id)
  # end

  # def doctor_ids
  #   Appointment.where(patient_id: user.id).pluck(:doctor_id)
  # end

  def admin_ids
    User.where(role: [:super_admin, :admin]).pluck(:id)
  end

  # def support_user_scope
  #   ChatParticipant.where("chat_id IN (?) AND participant_id != ?", user.chats.ids, user.id).pluck(:participant_id)
  # end
  
end