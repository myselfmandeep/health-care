module SuperAdmin
  class DashboardsController < ApplicationController

    def show
      mark_active_tab("dashboard")
      # @user = User.super_admin.first
    end
    
  end
end
