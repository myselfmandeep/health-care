module V1
  class Users < Grape::API

    helpers do
      def scope 
        @scope = UsersScope.new(current_user)
      end
    end
    
    resource :users do
      desc "fetch users listing"
      get "/" do
        users = scope.list.paginate(will_paginate)

        present users, with: V1::Entities::Users
      end
      
      desc "search for users"
      params do
        requires :query, type: String, desc: "Search Query"
      end
      get :search do
        users = scope.list.where("(full_name ILIKE :query OR username ILIKE :query OR email ILIKE :query) AND id != :c_user", {query: "%#{params[:query]}%", c_user: current_user.id})

        present users, with: V1::Entities::Users
      end

      desc "Invited users"
      namespace "/invitation/:code" do
        desc "Set password for invited user"
        params do
          # requires :password, type: String, desc: "Password"
          # requires :password_confirmation, type: String, desc: "Password Confirmation", same_as: :password
        end
        post "/set_password" do
          binding.pry
        end
      end
    end
  end
end