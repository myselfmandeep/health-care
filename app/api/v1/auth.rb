module V1
  class Auth < Grape::API

    get '/get_authentication_token' do
      session = request.session
      id =  session.to_h
                   .try(:dig, "warden.user.user.key")
                   .try(:flatten)
                   .try(:first)
      role = session[:role]

      error_response!("Login required") unless id
    
      {token: JwtToken.encode(user_id: id), user_id: id, role: role}
    end
    
    desc "Check the availability of username"
    params do
      optional :username, type: String, desc: "Username availability"
      optional :email, type: String, desc: "Email to check"
    end
    get "/is_taken_cred" do
      if params[:username].present?
        error!('Username is already taken', 409) if User.exists?(username: params[:username])
      elsif params[:email].present?
        error!('Email is already taken', 409) if User.exists?(email: params[:email])
      end
      
      status 200
    end
    
  end
end