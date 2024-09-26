module V1
  class Notifications < Grape::API

    desc "routes for notifications"
    resource :notifications do
      desc "get notifications"
      
      params do 
        requires :page, type: Integer, desc: "page no for pagination"
      end
      get do
        notifications = current_user.notifications.order(created_at: :desc).paginate(pagination(8))
        pagination_metadata = {
          current_page: notifications.current_page,
          next_page: notifications.next_page,
          prev_page: notifications.previous_page,
          total_pages: notifications.total_pages,
          total_entries: notifications.total_entries
        }
        
        {notifications: notifications, meta: pagination_metadata}
      end
    end
    
  end
end