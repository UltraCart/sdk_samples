require 'ultracart_api'
require_relative '../constants'

# validateOrder may be used to check for any and all validation errors that may result from an insert_order
# or update_order call. Because those methods are built on our existing infrastructure, some validation
# errors may not bubble up to the rest api call and instead be returned as generic "something went wrong" errors.
# This call will return detail validation issues needing correction.
#
# Within the ValidationRequest, you may leave the 'checks' array null to check for everything, or pass
# an array of the specific checks you desire. Here is a list of the checks:
#
# "Billing Address Provided"
# "Billing Destination Restriction"
# "Billing Phone Numbers Provided"
# "Billing State Abbreviation Valid"
# "Billing Validate City State Zip"
# "Email provided if required"
# "Gift Message Length"
# "Item Quantity Valid"
# "Items Present"
# "Merchant Specific Item Relationships"
# "One per customer violations"
# "Referral Code Provided"
# "Shipping Address Provided"
# "Shipping Destination Restriction"
# "Shipping Method Ignore Invalid"
# "Shipping Method Provided"
# "Shipping State Abbreviation Valid"
# "Shipping Validate City State Zip"
# "Special Instructions Length"

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

expansion = "checkout" # see the get_order sample for expansion discussion

order_id = 'DEMO-0009104976'
order = order_api.get_order(order_id, opts = { _expand: expansion }).order

p order

# TODO: do some updates to the order.
validation_request = UltracartClient::OrderValidationRequest.new
validation_request.order = order
validation_request.checks = nil # leaving this null to perform all validations.

api_response = order_api.validate_order(validation_request)

puts 'Validation errors:'
if api_response.errors
  api_response.errors.each do |error|
    puts error
  end
end

puts 'Validation messages:'
if api_response.messages
  api_response.messages.each do |message|
    puts message
  end
end