class RegistrationsController < Devise::RegistrationsController
  # skip_before_action :verify_authenticity_token
  after_action :set_role, only: %i[create]
  after_action :remove_role, only: %i[destroy]

  def create
    user = build_resource(sign_up_params)

    if user.save
      warden.set_user(user)
      # redirect_to after_sign_up_path_for(user)
      WelcomeMailer.welcome_email(user).deliver_now rescue nil
      redirect_to root_path
    else
      # render json: { errors: user.errors.full_messages }, status: 422
      render :new
    end
    
  end

  protected

  def after_sign_up_path_for(resource)
    if resource.patient?
      availability_doctors_path
    elsif resource.doctor?
      doctor_path(resource)
    else
      new_user_session_path
    end
  end
  
  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :full_name, :gender, :username, :date_of_birth, :contact, :password_confirmation, :current_password)
  end

  def account_update_params
    sign_up_params
  end

end