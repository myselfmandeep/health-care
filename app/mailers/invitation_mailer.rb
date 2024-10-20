class InvitationMailer < ApplicationMailer

  def support_invite(invitation)
    @invitation = invitation
    mail(to: @invitation.email, subject: "You are being invited by the admin of healthcare.")
  end
  
end
