module SuperAdmin
  class ApplicationController < ::ApplicationController
    before_action :check_super_admin?
  end
end
