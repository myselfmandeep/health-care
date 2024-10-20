module AccessControl
  extend ActiveSupport::Concern

  module ClassMethods
    def set_user_access(*actions, only: nil, except: nil)
      actions.each do |action|
        before_action action.to_sym, only: only, except: except
      end
    end
  end
  
  private
  
  def is_support_user?
    if current_user.try(:support?)
      redirect_to chats_path
    end
  end
  
end