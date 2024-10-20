module CacheUtil
  class << self
    
    def fetch_data(key)
      return nil unless data_exists?(key)

      get_data(key)
    end

    def data_exists?(key)
      Rails.cache.exist?(key)
    end
    
    def get_data(key)
      Rails.cache.read(key)
    end

    def set_data(key, data, expire_time: 15.minutes)
      data = format_data_for_cache(data)
      Rails.cache.write(key, data, expire_in: expire_time)

      data
    end
    
    def remove_data(key)
      Rails.cache.delete(key)
    end

    def format_data_for_cache(data)
      data.is_a?(ActiveRecord::Relation) ? data.to_a : data
    end
  end
end