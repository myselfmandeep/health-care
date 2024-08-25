class RegistrationsController < Devise::RegistrationsController
  skip_before_action :verify_authenticity_token

  def create
    user = build_resource(sign_up_params)

    if user.save
      render json: {token: JwtToken.encode(user_id: user.id)}, status: 201
    else
      render json: {errors: user.errors.full_messages }, status: 422
    end
    
  end

  private

  def sign_up_params
    params.require(:users).permit(:email, :password, :username)
  end

end