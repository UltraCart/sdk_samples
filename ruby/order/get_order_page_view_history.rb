require 'ultracart_api'
require_relative '../constants'

# getOrderPageViewHistory returns the page views captured during the session that placed an order, along
# with the referrer that started that session.
#
# A customer profile is NOT required.  These page views are keyed off an analytics client id stored on the
# order itself, so this works for guest orders.  For the email engagement side of customer activity, use
# get_order_customer_activity instead.
#
# An order placed outside the storefront, such as a phone order or an order imported from a channel
# partner, will have no analytics session attached.  In that case page_views comes back empty.  That is a
# successful response rather than an error.
#
# Note: view_dts is an ISO 8601 string here.  Be aware that the ts field on get_order_customer_activity is
# unix milliseconds instead, so do not assume the two methods format dates the same way.
#
# Possible Errors:
# order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0009104976'

begin
  api_response = order_api.get_order_page_view_history(order_id)
  page_views = api_response.page_views || []

  puts "Session referrer: #{api_response.referrer || '(none captured)'}"

  if page_views.empty?
    puts 'No page views were captured for this order.'
  else
    page_views.each do |page_view|
      time_on_page = page_view.time_on_page ? " (#{page_view.time_on_page}s on page)" : ''
      puts "#{page_view.view_dts} - #{page_view.url}#{time_on_page}"
    end

    # Using inspect instead of var_dump for Ruby-style object representation
    puts page_views.inspect
  end
rescue StandardError => e
  puts "An error occurred: #{e.message}"
end
