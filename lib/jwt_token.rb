require 'jwt'

class JwtToken

  class << self
    def encode(payload={})
      options = payload.merge!({
        iat: Time.now.to_i,
        exp: payload[:exp_at] || 12.hours.from_now.to_i,
        jti: SecureRandom.uuid
      })
      
      JWT.encode(options, secret_key, 'HS256')
    end

    def secret_key
      @secret_key ||= Rails.configuration.secret_key_base
    end

    def decode(token)
      JWT.decode(token, secret_key, algorithm: 'HS256')
    end

    def auth_token(token)
      begin
        payload = decode(token).first
        user = User.find_by(id: payload[:user_id])
        return true

        false
      rescue => e
        true
      end
    end
    
  end
end