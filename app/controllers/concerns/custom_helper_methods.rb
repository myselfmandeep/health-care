module CustomHelperMethods
  extend ActiveSupport::Concern

  def fetch_hosps
    key = "specialization"
    CacheUtil.fetch_data(key) || CacheUtil.set_data(key, Hospital.order(:name))
  end
  
  def fetch_specs
    key = "specialization"
    CacheUtil.get_data(key) || CacheUtil.set_data(key, Specialization.order(:name))
  end
  
end