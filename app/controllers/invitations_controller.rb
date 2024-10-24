class InvitationsController < ApplicationController
  before_action :validate_invitation, only: %i[accept_invite]
  before_action :check_super_admin?, only: %i[index]

  def index
    @invitations = Invitation.includes(:referrer)
    @invitations = @invitations.where("email ILIKE ?", "%#{params[:query]}%") if params[:query]
    @invitations = case params[:status]
    when "sent" then @invitations.sent
    when "accepted" then @invitations.accepted
    when "revoked" then @invitations.revoked
    when "registered" then @invitations.registered
    when "expired" then @invitations.expired
    else
                      @invitations
    end
                    .order(created_at: :desc)
                    .paginate(will_paginate)
  end

  def accept_invite
    if params[:accepted] == "false" && @invitation.sent?
      @invitation.revoked!
      redirect_to root_path, notice: "Invitation has been revoked"
    else
      user, message = User.create_user_without_validation(email: @invitation.email, role: "support")

      if user.present?
        warden.set_user(user)
        @invitation.update_column(:recipient_id, user.id)
        @invitation.registered!
        redirect_to edit_profile_path, notice: "Complete your profile"
      else
        redirect_to root_path, notice: message
      end

    end
  end

  private

  def set_invitation
    @invitation ||= Invitation.find_by(invite_code: params[:code])
  end

  def validate_invitation
    invite = set_invitation

    if current_user && current_user == invite.recipient
      redirect_to edit_profile_path
      return
    end

    begin
      raise "Invalid Invitation code" unless invite

      raise "User has already sign up with this invitation" if invite.registered?

      raise "Invitation has been expired" if invite.expired? || !invite.is_valid_invitation?

      raise "Invitation has been revoked by the invitee" if invite.revoked?

      invite
    rescue => e
      redirect_to root_path, notice: e.message
    end
  end
end
