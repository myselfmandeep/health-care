class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  def full_error_messages
    self.errors.full_messages
  end

  def self.votes_count(resource, vote)
    @votes = resource.votes

    react = vote.destroyed? ? "removed" : vote.reaction

    v_types = (@votes.group(:reaction).count).with_indifferent_access

    {
      likes: (v_types[:like] || 0),
      dislikes: (v_types[:dislike] || 0),
      vote_casted: react
    }
  end
end
