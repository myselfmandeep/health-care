module Broadcast
  class << self

    def transmit(identifier, payload)
      ActionCable.server.broadcast(identifier, payload)
    end
    
  end
end