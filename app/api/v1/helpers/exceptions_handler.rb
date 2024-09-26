module V1
  module Helpers
    module ExceptionsHandler
      extend ActiveSupport::Concern
  
      included do
        rescue_from ActiveRecord::RecordNotFound do |error|
          error!({ error: "Record not found" }, 404)
        end

        rescue_from ActiveRecord::RecordInvalid do |error|
          error!({ errors: error.record.errors.full_messages }, 422)
        end
  
        # rescue_from Policy::Error do
        #   error!({ error: "You don't have a permission to perform this action" }, 403)
        # end
  
        # rescue_from :all do |error|
        #   error!({ error: "Something went wrong" }, 500)
        # end
      
      end
    end
  end
end
