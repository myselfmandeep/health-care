module V1
  module SuperAdmin
    class Users < Grape::API
      desc "super user actions on users"

      resource :users do
        namespace "/:id" do
          params do
            requires :id, type: Integer, desc: "User ID"
          end
          before do
            @user = User.find(params[:id])
          end

          desc "change the account state of user"
          params do
            requires :state, type: String, desc: "role of the user", values: %w[active suspended]
          end
          put "/account_status" do
            if @user.update(state: params[:state])
              { state: @user.state, name: @user.full_name, success: true }
            else
              error_response!(@user.full_error_messages, 422)
            end
          end
        end
      end
    end
  end
end
