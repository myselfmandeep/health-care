module ApplicationHelper
  def table_row_color(appointment)
    if appointment.rejected?
      "table-danger"
    elsif appointment.confirmed?
      "table-success"
    elsif appointment.requested?
      "table-warning"
    elsif appointment.cancelled?
      "table-secondary"
    end
  end
end
