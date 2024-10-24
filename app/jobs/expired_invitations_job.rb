class ExpiredInvitationsJob
  include Sidekiq::Worker

  def perform(*args)
    invitations = Invitation.sent.where("valid_till < ?", Time.now)

    if invitations.present?
      invitations.update_all(status: :expired)
    end
  end
end
