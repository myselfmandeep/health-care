class SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token
  after_action :set_role, only: %i[create]
  after_action :remove_role, only: %i[destroy]

  def create
    self.resource = warden.authenticate!(auth_options)
    
    if resource.nil?
      flash[:alert] = "Invalid login credentials"
      redirect_to new_user_session_path
      return
    end
  
    if resource.active?
      set_flash_message!(:notice, :signed_in)
      sign_in(resource_name, resource)
      respond_with resource, location: after_sign_in_path_for(resource)
    else
      flash[:alert] = "Your account has been marked #{resource.state}."
      warden.logout(:user)
      render :new
    end
  end
  
  def destroy
    super
  end

  protected

  def after_sign_in_path_for(resource)
    if resource.super_admin?
      su_dashboard_path
    elsif resource.doctor?
      dashboard_doctor_path(resource.doctor_profile)
    else
      root_path
    end
  end
  
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
  end

end