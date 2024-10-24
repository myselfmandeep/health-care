module V1
  module Entities
    class Votes < Base
      # expose :votes, documentation: "Like Dislike count" do |vote, _opts|
      #   like_dislike = vote.voteable.votes.group(:is_liked).count
      #   # t_keys = like_dislike.transform_keys { |key| key ? "likes" : "dislikes" }

      #   {
      #     liked: vote.destroyed? ? nil : vote.is_liked?,
      #     dislikes: (like_dislike[false] || 0),
      #     likes: (like_dislike[true] || 0)
      #   }
      # end


      expose :votes do |vote, _opts|
        Vote.votes_count(vote.voteable, vote)
      end
    end
  end
end
