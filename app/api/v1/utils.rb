module V1
  module Utils 
    extend Grape::API::Helpers 

    def authenticate!
      has_error, err_msg, user = JwtToken.auth_token(request) 
      error!(err_msg, 401) if has_error

      error_response!("Your account has been suspended or removed. Please contact the adminstrator") if user.suspended? || user.removed?
      error_response!("You don't have a valid role. Please sign up to perform this action") unless user.role 

      @current_user ||= user
    end

    def is_super_admin?
      unless current_user.super_admin?
        error_response!("Super admin access required", 401) 
      end
    end

    def current_user
      authenticate! unless @current_user

      @current_user
    end

    def current_patient
      patient = current_user.patient
      error_response!("Patient Not available") unless patient.present?

      patient
    end

    def error_response!(errors=[], status=500)
      error_messages = errors
      if errors.is_a?(Hash) 
        error_messages << errors.values
      elsif errors.is_a?(Array)
        # error_messages.concat(errors)
      else
        error_messages << errors unless error_messages.is_a?(String)
      end
      
      error_messages << "Something went wrong" if error_messages.empty?

      error!({errors: error_messages}, status)
    end
    
    def success_response!(resp=[], code=200) 
      status
      resp
    end

    def is_action_allowed!(is_permissible) 
      error!("Action prohibited", 403) unless is_permissible
    end

    def warden
      env['warden']
    end

    def pagination(per_page=50)
      { page: params[:page], per_page: per_page }
    end

    def will_paginate
      { 
        page: params[:page],
        per_page: (params[:per_page] || 10) 
      }
    end

  end
end