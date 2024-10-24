module V1
  module SuperAdmin
    class Invitations < Grape::API
      resource :invitations do
        before do
          @referrer = current_user
        end

        desc "Invite users"
        params do
          requires :email, type: String, desc: "Email address of recipient"
          optional :role, as: :invitee_role, default: "support", type: String, desc: "Role assign to new user"
        end
        post do
          invite = @referrer.referrers.new(email: params[:email])

          if invite.save
            SendInvitationJob.perform_later(invite)
            # begin
            #   InvitationMailer.support_invite(invite).deliver_now
            #   status 201
            # rescue => e
            # error_response!(e.message)
            # end
            status 201
          else
            error_response!(invite.errors.full_messages, 422)
          end
        end
      end
    end
  end
end
