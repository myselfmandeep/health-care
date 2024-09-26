class AddReasonOfCancellationAndCancelledAtToAppointments < ActiveRecord::Migration[7.2]
  def change
    add_column :appointments, :cancelled_at, :datetime
    add_column :appointments, :cancellation_reason, :string
  end
end
