class OmniauthController < ApplicationController
  before_action :auth, only: %i[google]

  def google
    user_info = @oauth[:info]
    user = User.find_or_create_by(email: user_info[:email])

    unless user.persisted?
      user.assign_attributes({
        full_name: user_info[:name],
        password: SecureRandom.hex(10),
        uid: @oauth[:uid],
        provider: @oauth[:provider]
      })

      user.save(validate: false)
    end

    warden.set_user(user)

    redirect_to root_path, notice: "Sign in successfully"
  rescue Exception => e
    redirect_to new_user_session_path, notice: "Something went wrong while signin. Please try again."
  end

  def failure
    flash[:alert] = "Authentication failed: #{params[:message] || 'Access denied. Please try again.'}"
    redirect_to root_path
  end

  private

  def auth
    @oauth ||= request.env["omniauth.auth"]
  end
end
