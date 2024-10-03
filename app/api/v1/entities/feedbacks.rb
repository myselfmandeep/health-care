module V1
  module Entities 
    class Feedbacks < Base
      expose :id
      expose :body
      expose :user, using: Users
      expose :has_replies do |feedback, _opts|
        feedback.replies.exists?
      end
    end
  end
end