module V1
  class Votes < Grape::API

    helpers do
      def cast_vote
        @vote = @votes.new(declared(params, include_missing: false))
        error_response!(@vote.errors.full_messages) unless @vote.save
        @vote
      end
    end
    
    namespace :votes do
      params do 
        requires :id, as: :voteable_id, type: Integer, desc: "Resource ID"
        requires :user_id, type: Integer, desc: "User ID"
      end
      before do
        @resource = configuration[:resource].constantize.find(params[:id])
        @votes = @resource.votes
        @vote = @resource.votes.find_by(user_id: params[:user_id])
      end
      
      desc "Vote for resource #{configuration[:resource]}"
      params do
        requires :reaction, type: String, values: %w[like], desc: "Is Liked"
      end
      post "/upvote" do

        if @vote.nil?
          cast_vote
        elsif @vote.dislike? || @vote.neutral?
          @vote.like!
        elsif @vote.like?
          @vote.neutral!
        end
      
        present @vote, with: V1::Entities::Votes
      end

      desc "Down Vote"
      params do
        requires :id, as: :voteable_id, type: Integer, desc: "Resource ID"
        requires :user_id, type: Integer, desc: "User ID"
        requires :reaction, type: String, values: %w[dislike], desc: "Is Liked"
      end
      post "/downvote" do
        if @vote.nil?
          cast_vote
        elsif @vote.like? || @vote.neutral?
          @vote.dislike!
        elsif @vote.dislike?
          @vote.neutral!
        end

        present @vote, with: V1::Entities::Votes
      end
    end
  end
end