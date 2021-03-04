# frozen_string_literal: true

require 'json'
require 'ultracart_api'

simple_key = '109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00'
customer_api = UltracartClient::CustomerApi.new_using_api_key(simple_key, false, false)


customer = UltracartClient::Customer.new
customer.email = "joe-#{rand}@aol.com"
customer.password = "pw#{rand}"

shipping = UltracartClient::CustomerShipping.new
shipping.first_name = 'Joe'
shipping.last_name = 'Smith'
shipping.address1 = '206 Washington St SW'
shipping.city = 'Atlanta'
shipping.state_region = 'GA'
shipping.postal_code = '30334'
customer.shipping = [shipping] # notice this is an array of one shipping address (for now)

billing = UltracartClient::CustomerBilling.new
billing.first_name = 'Joe'
billing.last_name = 'Smith'
billing.company = 'Joe Inc.'
billing.day_phone = '4046561776'
billing.address1 = '206 Washington St SW'
billing.city = 'Atlanta'
billing.state_region = 'GA'
billing.postal_code = '30334'
customer.billing = [billing] # notice this is an array of one shipping address (for now)


# by default, UltraCart returns a minimal object.  If we want to see all the information we submitted, we need to
# ask for it back.  If we're only doing an insert and we don't care, _expand may be left empty.
# Possible expansion components:
#   shipping
#   billing
#   cards
#   pricing_tiers
#   cc_emails
#   orders_summary
#   quotes_summary
#   tax_codes
#   privacy
#   reviewer
#   attachments
#   software_entitlements
#   tags
#   loyalty

opts = {_expand: 'shipping,billing'}
begin
  customer_response = customer_api.insert_customer(customer, opts)
  puts customer_response.to_json
rescue UltracartClient::ApiError => ex
  puts "Error inserting customer: #{ex.json}"
  # Ruby does not give detailed error information.  Check the server logs.
  # Login to secure.ultracart.com, navigate to Home->Configuration->Development->API Keys
  # click the "log" button for your API key.
end

