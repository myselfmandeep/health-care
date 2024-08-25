class SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token

  def create
    user = User.find_by(email: params[:user][:email])
    if user&.valid_password?(params[:user][:password])
      warden.set_user(user)
      render json: { token: JwtToken.encode(user_id: user.id) }, status: 200
    else
      render json: { errors: ['Invalid email or password'] }, status: 401
    end
  end

  
end