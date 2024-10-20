class SendInvitationJob < ApplicationJob
  # include Sidekiq::Job

  sidekiq_options retry: 5

  def perform(invitation)
    InvitationMailer.support_invite(invitation).deliver_now
  end
  
end