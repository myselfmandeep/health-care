class ProfilesController < ApplicationController
  before_action :authenticate_user!, :set_user

  def edit
  end
  
  def update
    if @user.update(profile_params)
      sign_in(current_user, bypass: true)

      redirect_to root_path, notice: "Profile has been updated!"
    else
      render :edit
    end
  end

  private

  def profile_params
    params.require(:user).permit(:full_name, :password, :password_confirmation, :gender, :date_of_birth)
  end

  def set_user
    @user = current_user
  end
  
end