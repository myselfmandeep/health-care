class ApplicationPolicy

  include Policy

  def initialize(user)
    @user = user
  end

  private

  def super_admin?
    @user.has_role?(Role::SUPER_ADMIN)
  end

  def workspace_admin?
    @user.has_role?(Role::WORKSPACE_ADMIN)
  end

  def workspace_moderator?
    @user.has_role?(Role::WORKSPACE_MODERATOR)
  end

  def workspace_user?
    @user.has_role?(Role::WORKSPACE_USER)
  end

  def user_has_any_role?
    @user.has_any_role? *Role::ROLES
  end
end
