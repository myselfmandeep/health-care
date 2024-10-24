module InvitationHelper
  def inv_referrer(ref)
    current_user && current_user == ref ? "You" : ref.full_name
  end
end
