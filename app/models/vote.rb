class Vote < ApplicationRecord
  belongs_to :voteable, polymorphic: true
  belongs_to :user

  enum reaction: %i[like dislike neutral]
  
  # default_scope -> {where(removed_at: nil)}

  validates :user, uniqueness: {scope: :voteable, message: "has already liked this resource"}, on: :create

end