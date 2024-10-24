module ErrorHandlers
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound, with: :not_found
  end

  def not_found
    render template: "errors/not_found"
  end
end
