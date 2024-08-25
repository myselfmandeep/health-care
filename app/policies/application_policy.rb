class ApplicationPolicy

  include Policy

  def initialize(user)
    @user = user
  end

end
