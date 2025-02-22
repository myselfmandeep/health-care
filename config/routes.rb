require "sidekiq/web"

Rails.application.routes.draw do
  devise_for :users,
              # defaults:    { format: :json },
              path: "auth",
              controllers: {
                registrations: "registrations",
                passwords: "passwords",
                sessions: "sessions"
              },
              path_names: {
                sign_in: "login"
              }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  mount Base, at: "/#{Base::PREFIX}"
  # mount Sidekiq::Web => '/sidekiq'

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get "/auth/:provider/callback", to: "omniauth#google"
  get "/auth/failure", to: "omniauth#failure"
  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  root "doctors#index", defaults: { tab: "root" }
  get "/test", to: "tests#test"
  get "/navbar", to: "tests#navbar"
  get "/dashboard", to: "welcome#dashboard"

  namespace :super_admin, as: :su do
    resource :dashboard, only: %i[show] do
      collection do
        get :users
        get :appointments
      end
    end

    resource :director, only: %i[] do
      collection do
        get :add_doctor
        get :add_hospital
        get :list_users
        get :appointments
        get :invitations
      end
    end
  end

  resources :appointments, only: %i[index] do
    collection do
      get ":appt_code/feedback", to: "appointments#feedback", as: :appt_feedback
    end
  end

  resources :specializations, only: %i[index] do
    member do
      get :hospitals
      get :doctors
    end
    collection do
      get :search
    end
  end

  resources :hospitals, only: %i[index show edit] do
    member do
      get :departments
      get :doctors
    end
    collection do
      get :search
    end
  end
  resources :departments, only: %i[] do
    member do
      get :doctors
    end
  end
  resources :doctors, only: %i[index show edit update] do
    collection do
      get :search
      get :availability
    end

    member do
      get :book_appointment
      get :appointments
      get :dashboard
    end
  end

  resources :patients, only: %i[index show] do
    member do
      get :appointments
    end
  end

  resources :chats, only: %i[index]

  resources :invitations, only: %i[index] do
    collection do
      get "/accept_invite/:code", to: "invitations#accept_invite", as: :accept
      post "/set_password", to: "invitations#set_password", as: :password
    end
  end

  resource :profile, only: %i[edit update]
end
