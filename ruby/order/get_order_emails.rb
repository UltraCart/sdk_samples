require 'ultracart_api'
require_relative '../constants'

# getOrderEmails returns the delivery records for every email UltraCart sent regarding an order, oldest
# first.  Each record carries the subject and send time plus delivery, open, click and bounce status,
# which makes this useful evidence that a customer was notified about their order.
#
# A customer profile is NOT required.  These records are tied to the order id itself.
#
# An order with no email history, or one whose emails were all suppressed, comes back with an empty emails
# array.  That is a successful response rather than an error.
#
# The internal flag marks messages sent to merchant staff rather than to the customer.  Filter those out
# if you only want what the customer actually received.
#
# Possible Errors:
# order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104976'

begin
  api_response = order_api.get_order_emails(order_id)
  emails = api_response.emails || []

  if emails.empty?
    puts 'No emails were sent for this order.'
  else
    emails.each do |email|
      puts "#{email.send_dts} - #{email.email} - #{email.subject}"

      status = []
      status << "delivered #{email.delivery_dts}" if email.delivered
      status << "opened #{email.opened_dts}" if email.opened
      status << "clicked #{email.clicked_dts}" if email.clicked
      status << "skipped: #{email.skip_reason}" if email.skipped
      status << "bounced #{email.bounce_type}/#{email.bounce_sub_type}" if email.bounce_type

      puts "    #{status.empty? ? 'no delivery events recorded' : status.join(', ')}"
    end
  end
rescue StandardError => e
  puts "An error occurred: #{e.message}"
end
