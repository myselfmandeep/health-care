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
    
  end
end