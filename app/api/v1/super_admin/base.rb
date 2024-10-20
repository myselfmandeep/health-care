module V1
  module SuperAdmin
    class Base < Grape::API
      
      before do
        is_super_admin?
      end

      mount Doctors
      mount Hospitals
      mount Users
      mount Invitations
      
      get '/hello' do
      #  is_super_admin?
      end
      
    end
  end
end