class PasswordsController < Devise::PasswordsController
  skip_before_action :verify_authenticity_token

  def create
    resource = resource_class.send_reset_password_instructions(sign_up_params)

    if resource.persisted?
      render json: { message: 'Password reset instructions sent to your email.' }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:email)
  end

end
