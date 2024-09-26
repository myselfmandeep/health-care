class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  def full_error_messages
    self.errors.full_messages
  end
  
end
