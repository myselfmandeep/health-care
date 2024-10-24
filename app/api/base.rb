class Base < Grape::API
  PREFIX = "api"
  format :json

  mount V1::Base => "/#{V1::Base::VERSION}"

  get "/ping" do
    { ping: "pong" }
  end

  desc "Handle Invalid Paths"
  route :any, "*path" do
    error! "Route is not found", 404
  end
end
