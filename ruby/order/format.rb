# format() returns back a text-formatted or html block for displaying an order.  It is similar to what you would
# see on a receipt page.

require_relative '../constants'
require 'ultracart_api'

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

# Configure format options
format_options = UltracartClient::OrderFormat.new
format_options.set_context('receipt') # unknown,receipt,shipment,refund,quote-request,quote
format_options.set_format('table') # text,div,table,email
format_options.set_show_contact_info(false)
format_options.set_show_payment_info(false) # might not want to show this to just anyone.
format_options.set_show_merchant_notes(false) # be careful showing these
format_options.set_email_as_link(true) # makes the email addresses web links
# if you only wish to show the items for a particular distribution center,
# this might be useful if you have set_context('shipment') and you're displaying this order to a fulfillment center, etc
# format_options.set_filter_distribution_center_oid(1234321)
format_options.set_link_file_attachments(true)
format_options.set_show_internal_information(true) # consider this carefully.
format_options.set_show_non_sensitive_payment_info(true) # what the customer usually sees
format_options.set_show_in_merchant_currency(true)
format_options.set_hide_bill_to_address(false)
# format_options.set_filter_to_items_in_container_oid(123454321) # you probably won't need this.
# when an order displays on the secure.ultracart.com site, we link the email to our order search so you can quickly
# search for all orders for that email.  I doubt you would have use for that.  But maybe.
format_options.set_dont_link_email_to_search(true)
format_options.set_translate(false) # if true, shows in customer's native language

order_id = 'DEMO-0009104390'

api_response = order_api.format(order_id, format_options)

formatted_result = api_response.get_formatted_result

# Render the formatted result (note: removed HTML wrapping per guidelines)
api_response.get_css_links.each do |link|
  puts "<style type='text/css'>#{link}</style>"
end
puts formatted_result