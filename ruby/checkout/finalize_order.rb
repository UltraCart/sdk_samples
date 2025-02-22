require 'ultracart_api'
require_relative '../constants'
# Reference Implementation: https://github.com/UltraCart/responsive_checkout

# Note: You probably should NOT be using this method.  Use handoff_cart() instead.
# This method is a server-side only (no browser key allowed) method for turning a cart into an order.
# It exists for merchants who wish to provide their own upsells, but again, a warning, using this method
# will exclude the customer checkout from a vast and powerful suite of functionality provided free by UltraCart.
# Still, some merchants need this functionality, so here it is.  If you're unsure, you don't need it.  Use handoff.

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)

expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes"
# Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html
# affiliate                   checkout	                        customer_profile
# billing                     coupons                             gift
# gift_certificate	          items.attributes	                items.multimedia
# items	                      items.multimedia.thumbnails         items.physical
# marketing	                  payment	                            settings.gift
# settings.billing.provinces	settings.shipping.deliver_on_date   settings.shipping.estimates
# settings.shipping.provinces	settings.shipping.ship_on_date	    settings.taxes
# settings.terms	            shipping	                        taxes
# summary	                    upsell_after

cart_id = nil
cart_id = cookies[Constants::CART_ID_COOKIE_NAME] if cookies[Constants::CART_ID_COOKIE_NAME]

cart = nil
if cart_id.nil?
  api_response = checkout_api.get_cart(_expand: expansion)
else
  api_response = checkout_api.get_cart_by_cart_id(cart_id, _expand: expansion)
end
cart = api_response.cart

# TODO - add some items, collect billing and shipping, use hosted fields to collect payment, etc.

finalize_request = UltracartClient::CartFinalizeOrderRequest.new
finalize_request.cart = cart
finalize_options = UltracartClient::CartFinalizeOrderRequestOptions.new  # Lots of options here. Contact support if you're unsure what you need.
finalize_request.options = finalize_options

api_response = checkout_api.finalize_order(finalize_request)
# api_response.successful
# api_response.errors
# api_response.order_id
# api_response.order

puts api_response.inspect