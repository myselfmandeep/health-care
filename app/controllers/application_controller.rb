class ApplicationController < ActionController::Base
  include ErrorHandlers
  include AccessControl
  include CustomHelperMethods
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :notifications, :check_non_active_user
  before_action :configure_permitted_parameters, if: :devise_controller?
  helper_method :fetch_hosps, :fetch_specs

  def notifications
    return unless current_user.present?
    @notifications = current_user.notifications.order(created_at: :desc).paginate(pagination(8))
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:full_name, :username, :gender, :date_of_birth])
  end

  def pagination(per_page=50)
    { page: params[:page], per_page: per_page }
  end

  def will_paginate
    {
      page: params[:page],
      per_page: (params[:per_page] || ENV['PER_PAGE'])
    }
  end
  
  private

  def check_non_active_user
    if current_user.present? && !current_user.active?
      flash[:notice] = "Your account has been marked #{current_user.state}"
      warden.logout(:user)
      redirect_to new_user_session_path
    end 
  end

  def current_id 
    session.to_h
           .try(:dig, "warden.user.user.key")
           .try(:flatten)
           .try(:first)
  end

  def check_super_admin?
    authenticate_user!
    
    unless current_user.super_admin?
      flash[:notice] = "Super Admin Access required to to access this section"
      redirect_to root_path
    end
  end

  def set_role
    session[:role] = current_user.try(:role)
  end

  def remove_role
    session[:role] = nil
  end

  def mark_active_tab(tab)
    params[:tab] = tab
  end

  # def is_support_user?
  #   if current_user.try(:support?)
  #     redirect_to chats_path
  #   end
  # end

end
