require 'active_support/concern'

module Policy

  extend ActiveSupport::Concern

  # Policy failure for direct calls
  # [Policy::Error]
  class Error < ::StandardError; end

  # Check if the given operation is allowed or not.
  # 
  # @example calling a policy
  #   p = MyPolicy.new(User.find(1))
  #   p.check?(:operation, id: 5) # calls p.operation?(id: 5)
  #
  # @return [Boolean] operation allowed or not.
  def check?(method, **opts)
    method = "#{method}?".to_sym
    send(method, **opts)
  end

  # Check whether the given operation is allowed, raising {Policy::Error} if not.
  #
  # @example calling a policy
  #   p = MyPolicy.new(User.find(1))
  #   p.check!(:operation, id: 5) # calls p.operation?(id: 5)
  #
  # @raise [Policy::Error] if the operation is disallowed.
  def check!(method, **opts)
    check?(method, **opts).tap do |res|
      raise Policy::Error, 'disallowed!' unless res
    end
  end

end
