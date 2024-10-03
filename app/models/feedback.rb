class Feedback < ApplicationRecord
  self.per_page = 5
  
  belongs_to :appointment, optional: true
  belongs_to :user
  belongs_to :parent_feedback, class_name: "Feedback", optional: true
  has_many :replies, class_name: "Feedback", foreign_key: :parent_feedback_id
  
  validates :body, presence: true, length: { minimum: 2 }
end