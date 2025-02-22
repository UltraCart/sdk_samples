require 'ultracart_api'
require_relative '../constants'

# OrderApi.getOrderByToken() was created for use within a custom thank-you page.  The built-in StoreFront
# thank you page displays the customer receipt and allows for unlimited customization.  However, many
# merchants wish to process the receipt page on their own servers to do custom processing.
#
# See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377199/Custom+Thank+You+Page+URL
#
# When setting up a custom thank-you url in the StoreFronts, you will provide a query parameter that will hold
# this order token.  You many extract that from the $_GET object, then turn around and call getOrderByToken
# to get the order object.
order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

# The expansion variable instructs UltraCart how much information to return.  The order object is large and
# while it's easily manageable for a single order, when querying thousands of orders, is useful to reduce
# payload size.
# see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
=begin
Possible Order Expansions:
affiliate           affiliate.ledger                    auto_order
billing             channel_partner                     checkout
coupon              customer_profile                    digital_order
edi                 fraud_score                         gift
gift_certificate    internal                            item
linked_shipment     marketing                           payment
payment.transaction quote                               salesforce
shipping            shipping.tracking_number_details    summary
taxes
=end

expansion = "billing,checkout,coupon,customer_profile,item,payment,shipping,summary,taxes"

# the token will be in a $_GET parameter defined by you within your storefront.
# StoreFront -> Privacy and Tracking -> Advanced -> CustomThankYouUrl
# Example would be: www.mysite.com/receipt.php?orderToken=[OrderToken]

# TODO: Replace with actual method of retrieving order token in Ruby
# For example, if using Rack or Rails, you might use params[:order_token]
order_token = 'DEMO:UZBOGywSKKwD2a5wx5JwmkwyIPNsGrDHNPiHfxsi0iAEcxgo9H74J/l6SR3X8g=='

# TODO (for you, the merchant): handle missing order token (perhaps this page somehow called by a search engine, etc).

begin
  opts = {
    '_expand' => expansion
  }

  api_response = order_api.get_order_by_token(order_token, opts)
  order = api_response.order

  # Using inspect instead of var_dump for Ruby-style object representation
  puts order.inspect
rescue StandardError => e
  puts "An error occurred: #{e.message}"
end