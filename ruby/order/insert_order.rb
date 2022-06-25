# This is important:
# You cannot use the Order API to insert an order.
# Orders can only be created using the Checkout API. It contains a huge amount of validations and routines
# to ensure order integrity.  So the example below uses the Checkout API.
#
# This is equally important:
# You cannot just add credit card numbers.  The UltraCart system is designed from the "Security First".
# As such, the system is designed so that merchants never touch credit card numbers.  With that said, the API
# must be able to interact with credit card numbers in a limited sense.  To do so, you will need to use Hosted
# Fields.  Hosted fields are a set of javascript scripts designed for a web page that encapsulate credit card fields
# inside iframes to prevent script attacks.  If you need to provide credit cards (as the merchant) using the API,
# you'll have to create a web page that has hosted fields, enter the credit card information, and then use
# the subsequently provided token within your API objects to associate the credit card with the api object.
#
# Common objections to this insane amount of trouble to work with credit cards:
# Objection 1: You can trust me.
# Response 1: You? Maybe.  The other guy?  No.  Experience has shown us that if we allow it, developers will misuse it.
#
# Objection 2: I need to automate something.
# Response 2:  There is nothing you need to automate with credit cards.  Also, touching credit cards in any way moves
# your code and your machines within PCI scope and could require you to provide expensive auditing of that code and
# equipment should a payment company target you for an audit.
#
# Objection 3: My customers need to manage their information.
# Response 3: We have tremendous tools and web pages already built and free to you, the merchant, that allow customers
# to manage their own credit cards.  We have email communication routines and powerful engines to keep track of customer
# information and alert them to self-service any of their information should the need arise.
#

# frozen_string_literal: true

require 'json'
require 'ultracart_api'
require_relative '../constants'

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)
customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

# ----------------------------------------------------------------------------------
# expansion should contain all the objects that will be needed throughout the checkout.
# see https://www.ultracart.com/api/#Topic3 for the complete list.
# This expansion list should be supplied for each get/put throughout or data may be lost on the return objects.
expansion = 'billing,checkout,coupons,items,payment,settings.shipping.estimates,shipping,summary,taxes,coupons'
# The expansion above doesn't include much of the item objects because they're not needed.  For example, we don't
# need the item multimedia because we're not showing this cart to an end customer like a javascript implementation would
# if you needed to show images and such to a customer, then add 'items' to the csv above.  Better, yet, if you need to do
# all that, use javascript instead.
# ----------------------------------------------------------------------------------

# look at an existing customer profile, grab the first shipping address, if any, and create a CartShipping object
def get_shipping_from_profile(customer_profile)
  shipping = nil

  if customer_profile.shipping&.length&.positive?
    shipping = UltracartClient::CartShipping.new
    shipping.company = customer_profile.shipping.company
    shipping.first_name = customer_profile.shipping.first_name
    shipping.last_name = customer_profile.shipping.last_name
    shipping.address1 = customer_profile.shipping.address1
    shipping.address2 = customer_profile.shipping.address2
    shipping.city = customer_profile.shipping.city
    shipping.postal_code = customer_profile.shipping.postal_code
    shipping.state_region = customer_profile.shipping.state_region
    shipping.country_code = customer_profile.shipping.country_code
    shipping.day_phone = customer_profile.shipping.day_phone
    shipping.evening_phone = customer_profile.shipping.evening_phone
  end

  shipping
end

# look at an existing customer profile, grab the first billing address, if any, and create a CartBilling object
def get_billing_from_profile(customer_profile)
  billing = nil

  if customer_profile.billing&.length&.positive?
    billing = UltracartClient::CartBilling.new
    billing.company = customer_profile.billing.company
    billing.first_name = customer_profile.billing.first_name
    billing.last_name = customer_profile.billing.last_name
    billing.address1 = customer_profile.billing.address1
    billing.address2 = customer_profile.billing.address2
    billing.city = customer_profile.billing.city
    billing.postal_code = customer_profile.billing.postal_code
    billing.state_region = customer_profile.billing.state_region
    billing.country_code = customer_profile.billing.country_code
    billing.day_phone = customer_profile.billing.day_phone
    billing.evening_phone = customer_profile.billing.evening_phone
  end

  billing
end

begin

  email = 'test@test.com'
  cc_mask = 'XXXXXXXXXXXX1234'
  cvv_mask = 'XXX'
  cc_token = 'F893C8CBAE34830177F9EA9D97205400'
  cvv_token = '3FA7577E42F7580177F9EAA2FF1F5900'

  get_response = checkout_api.get_cart(_expand: expansion)
  if get_response.errors&.length&.positive?
    # handle errors here.
    abort('System error.  Could not retrieve shopping cart.')
  else
    cart = get_response.cart
  end

  items = []
  item = UltracartClient::CartItem.new
  item.item_id = 'BONE'
  item.quantity = 1

  # This 'Bone' item within the DEMO account has a single item option.
  # To get the name and possible values of, use the Item API and query the item.
  item_option = UltracartClient::CartItemOption.new
  item_option.name = 'Addon Treat'
  item_option.selected_value = 'No thanks'
  item.options = [item_option]

  items.push(item)
  cart.items = items

  # If the customer already has a customer profile, then load that profile and pull the shipping/billing from there.
  # otherwise populate it manually.
  customer_response = customer_api.get_customer_by_email(email, { _expand: 'shipping,billing,cards' })
  if customer_response&.customer

    cp = customer_response.customer # cp is short for 'customer profile'
    cart.shipping = get_shipping_from_profile(cp)
    cart.billing = get_billing_from_profile(cp)

  end

  # if we didn't load the shipping from a customer profile, add it here (assume this data is collected from somewhere)
  unless cart.shipping
    shipping = UltracartClient::CartShipping.new
    shipping.company = 'UltraCart'
    shipping.first_name = 'Perry'
    shipping.last_name = 'Smith'
    shipping.address1 = '55 Main Street'
    shipping.address2 = 'Suite 101'
    shipping.city = 'Duluth'
    shipping.postal_code = '30097'
    shipping.state_region = 'GA'
    shipping.country_code = 'US'
    shipping.day_phone = '404-656-1776'
    shipping.evening_phone = '404-656-1776'
    cart.shipping = shipping
  end

  unless cart.billing
    billing = UltracartClient::CartBilling.new
    billing.company = 'UltraCart'
    billing.first_name = 'Perry'
    billing.last_name = 'Smith'
    billing.address1 = '55 Main Street'
    billing.address2 = 'Suite 101'
    billing.city = 'Duluth'
    billing.postal_code = '30097'
    billing.state_region = 'GA'
    billing.country_code = 'US'
    billing.day_phone = '404-656-1776'
    billing.evening_phone = '404-656-1776'
    billing.email = email
    cart.billing = billing
  end
  
  # --- Payment Block ---
  payment = UltracartClient::CartPayment.new
  credit_card = UltracartClient::CartPaymentCreditCard.new

  credit_card.card_number = cc_mask
  credit_card.card_expiration_month = 3
  credit_card.card_expiration_year = 2031
  credit_card.card_type = 'Visa'
  credit_card.card_number_token = cc_token
  credit_card.card_verification_number = cvv_mask
  credit_card.card_verification_number_token = cvv_token

  payment.payment_method = 'Credit Card'
  payment.credit_card = credit_card
  cart.payment = payment
  # --- End Payment Block ---

  # add a coupon.
  coupon = UltracartClient::CartCoupon.new
  coupon.coupon_code = '10OFF' # you'll need to create a coupon first, you know?
  cart.coupons = [coupon]

  # for best results, set the shipping address and update the server before
  # setting the shipping method.  the cart that is returned below will have
  # the optimal shipping method estimates and ensure that you don't error
  # by selecting a shipping method that is somehow excluded from the possible
  # list for whatever reason (restrictions, locations, item-level constraints, etc)
  update_response = checkout_api.update_cart(cart, _expand: expansion)
  cart = update_response.cart

  # for shipping, check the estimates and select one.  for a completely non-interactive checkout such as this,
  # the shipping method will either be known beforehand (hard-coded) or use the least expensive method.  The
  # least expensive method is always the first one, so for this example, I'll select the first shipping method.
  if cart.settings&.shipping
    shipping_settings = cart.settings.shipping
    estimates = shipping_settings.estimates
    if estimates != nil && estimates.length.positive?
      cart.shipping.shipping_method = estimates[0].name
    end
  end

  update_response = checkout_api.update_cart(cart, _expand: expansion)
  cart = update_response.cart

  # validate the cart to ensure everything is in order.
  validation_request = UltracartClient::CartValidationRequest.new
  validation_request.cart = cart # I don't set the checks variable.  standard checks are usually sufficient.
  validation_response = checkout_api.validate_cart(validation_request)

  errors = []
  order = nil

  if validation_response.errors == nil || validation_response.errors.length.zero?
    finalize_request = UltracartClient::CartFinalizeOrderRequest.new
    finalize_request.cart = cart
    finalize_response = checkout_api.finalize_order(finalize_request)

    if finalize_response
      if finalize_response.successful
        order = finalize_response.order
      else
        errors = finalize_response.errors
      end
    end

  else
    errors = validation_response.errors
  end

rescue UltracartClient::ApiError => ex
  puts ex.to_json
  abort(ex.message)
end

puts 'Errors follow:'
puts errors.to_json

puts 'Order follows:'
puts order.to_json