class ApplicationScope

  attr_reader :user
  
  def initialize(current_user)
    @user = current_user
  end

  def super_admin?
    user.super_admin?
  end

  def patient?
    user.patient?
  end

  def doctor?
    user.doctor?
  end
  
end