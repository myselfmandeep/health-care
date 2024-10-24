module V1
  class Base < Grape::API
    include V1::Helpers::ExceptionsHandler

    VERSION = "v1"

    helpers V1::Utils

    mount V1::Hospitals
    mount V1::Departments
    mount V1::DoctorProfiles
    mount V1::Appointments
    mount V1::General
    mount V1::Auth
    mount V1::Specializations
    mount V1::Notifications
    mount V1::Chats
    mount V1::Messages
    mount V1::Users
    mount V1::Feedbacks

    mount V1::SuperAdmin::Base

    get "/home" do
      # authenticate!
      # User.find(1000000000)
    end

    get "/hello_world" do
      # Invitation.all
      # User.first
      params
    end
  end
end
