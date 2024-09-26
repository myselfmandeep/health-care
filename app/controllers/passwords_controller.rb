class PasswordsController < Devise::PasswordsController
  skip_before_action :verify_authenticity_token

  def create
    self.resource = resource_class.send_reset_password_instructions(sign_up_params)
  
    if successfully_sent?(resource)
      flash[:notice] = "Password reset instructions sent to your email."
      redirect_to new_user_session_path
    else
      # Render the password reset form again with the correct resource
      self.resource = resource_class.new
      resource.errors.add(:base, "user not found!")
      render :new
    end
  rescue
    self.resource = resource_class.new
    resource.errors.add(:base, "Unfortunately our system is unable to deliver mail to you. Please try again later!")
    render :new
  end
  

  private

  def sign_up_params
    params.require(:user).permit(:email)
  end

end
