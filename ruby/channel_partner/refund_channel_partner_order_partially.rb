require 'securerandom'
require_relative '../constants'
require 'ultracart_api'

# IMPORTANT: Do NOT construct the refunded order. This method does a refund but also update the entire object, so start with an order query.
# ALWAYS start with an order retrieved from the system.
# 1. Call getChannelPartnerOrder or getChannelPartnerOrderByChannelPartnerOrderId to retrieve the order being refunded
# 2. For a partial refund, reverse the following:
#    A. Set the refunded qty and refunded amount for each item.
#    B. Set the refunded tax (if any)
#    C. Set the refunded shipping (if any)
#    D. As you refund an amount, aggregate that into a total.
# NOTE: refund amounts are positive numbers. If any item total cost is $20.00, a full refunded amount of that item would also be positive $20.00
# See the ChannelPartnerApi.getChannelPartnerOrder() sample for details on that method.

# For this sample, I've created a test order of jewelry beads with the following items:
# You will need to create your own item to run this sample.
#
# rivoli_14mm_ab      4   Crystal Rivolis - Aurora Borealis Collection 14mm | Pack of 10      59.80
# rivoli_14mm_birth   6   Crystal Rivolis - Birthstone Collection 14mm | Pack of 14           125.70
# rivoli_14mm_colors  3   Crystal Rivoli Colorshift Collection - Crystal 14mm | Pack of 10    44.85
# rivoli_14mm_mystic  2   Crystal Rivolis - Mystic Collection 14mm | Pack of 12               47.90
# rivoli_14mm_opal    4   Crystal Rivolis - Opal Collection 14mm | Pack of 12                 107.80
#
#                                                                     Subtotal                386.05
#                                                                     Tax Rate                7.00%
#                                                                     Tax                     27.02
#                                                                     Shipping/Handling       10.70
#                                                                     Gift Charge             2.95
#                                                                     Total                   $426.72
#
# In this example, my customer wishes to refund all birth stones and two of the opal stones, so I'm going to refund
# the second and last items on this order.
#
# Steps:
# 1) Fully refund the birth stones, quantity 6, cost 125.70.
# 2) Partially refund the opal stones, quantity 2, cost 53.90
# 3) Refund the appropriate tax. 7% tax for the refund item amount of 179.60 is a tax refund of 12.57
# 4) Total (partial) refund will be 125.70 + 53.90 + 12.57 = 192.18
#
# There is no shipping refund for this example. The beads are small, light and only one box was being shipped. So,
# for this example, I am not refunding any shipping.

channel_partner_api = UltracartClient::ChannelPartnerApi.new_using_api_key(Constants::CHANNEL_PARTNER_API_KEY)
# for a comment on this expansion, see getChannelPartnerOrder sample.
# I don't need billing and shipping address for the refund, but I could need the shipping costs.
# I'm not using coupons or gift_certificates
expansion = "item,summary,shipping,taxes,payment"

def generate_secure_random_string(length = 10)
  SecureRandom.hex(length / 2)
end

# --------------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------
# Step 1: Create my channel partner order. To keep this simple, I'm just using a payment method of Purchase Order.
# Note: This is a stripped down importOrder example. See importChannelPartner sample for detailed fields.

order = UltracartClient::ChannelPartnerOrder.new

order.associate_with_customer_profile_if_present = true
order.auto_approve_purchase_order = true
order.billto_address1 = "11460 Johns Creek Parkway"
order.billto_address2 = "Suite 101"
order.billto_city = "Duluth"
order.billto_company = "Widgets Inc"
order.billto_country_code = "US"
order.billto_day_phone = "6784153823"
order.billto_evening_phone = "6784154019"
order.billto_first_name = "John"
order.billto_last_name = "Smith"
order.billto_postal_code = "30097"
order.billto_state_region = "GA"
order.billto_title = "Sir"
order.cc_email = "orders@widgets.com"
order.channel_partner_order_id = "sdk-" + generate_secure_random_string
order.consider_recurring = false
order.payment_method = "Purchase Order"
order.purchase_order_number = generate_secure_random_string
order.email = "ceo@widgets.com"
order.ip_address = "34.125.95.217"

# -- Items start ---
item1 = UltracartClient::ChannelPartnerOrderItem.new
item1.merchant_item_id = "rivoli_14mm_ab"
item1.quantity = 4

item2 = UltracartClient::ChannelPartnerOrderItem.new
item2.merchant_item_id = "rivoli_14mm_birth"
item2.quantity = 6

item3 = UltracartClient::ChannelPartnerOrderItem.new
item3.merchant_item_id = "rivoli_14mm_colors"
item3.quantity = 3

item4 = UltracartClient::ChannelPartnerOrderItem.new
item4.merchant_item_id = "rivoli_14mm_mystic"
item4.quantity = 2

item5 = UltracartClient::ChannelPartnerOrderItem.new
item5.merchant_item_id = "rivoli_14mm_opal"
item5.quantity = 4

order.items = [item1, item2, item3, item4, item5]
# -- Items End ---

order.least_cost_route = true # Give me the lowest cost shipping
order.least_cost_route_shipping_methods = ["FedEx: Ground", "UPS: Ground", "USPS: Retail Ground"]
order.mailing_list_opt_in = true # Yes, I confirmed with the customer personally they wish to be on my mailing lists.
order.screen_branding_theme_code = "SF1986" # Theme codes predated StoreFronts. Each StoreFront still has a theme code under the hood. We need that here. See this screen to find your code: https://secure.ultracart.com/merchant/configuration/customerServiceLoad.do
order.ship_to_residential = true
order.shipto_address1 = "55 Main Street"
order.shipto_address2 = "Suite 202"
order.shipto_city = "Duluth"
order.shipto_company = "Widgets Inc"
order.shipto_country_code = "US"
order.shipto_day_phone = "6785552323"
order.shipto_evening_phone = "7703334444"
order.shipto_first_name = "Sally"
order.shipto_last_name = "McGonkyDee"
order.shipto_postal_code = "30097"
order.shipto_state_region = "GA"
order.shipto_title = "Director"
order.skip_payment_processing = false
order.special_instructions = "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages"
order.store_completed = false # this will bypass everything, including shipping. useful only for importing old orders long completed
order.storefront_host_name = 'store.mysite.com'
order.store_if_payment_declines = false # if payment fails, this can send it to Accounts Receivable. Do not want that. Fail if payment fails.
order.tax_county = "Gwinnett"
order.tax_exempt = false
order.treat_warnings_as_errors = true

api_response = channel_partner_api.import_channel_partner_order(order)
order_id = api_response.order_id

puts "Created sample order #{order_id}"

# --------------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------
# Step 2: Refund my channel partner order.
# This order MUST be an order associated with this channel partner, or you will receive a 400 Bad Request.
# I'll need to get the order first, so I'm issuing another get to retrieve the order.
# order_id = 'DEMO-0009118954' # <-- I created my order above, so I'll have the order_id from that response
api_response = channel_partner_api.get_channel_partner_order(order_id, opts = {'_expand' => expansion})

if api_response.error != nil
  puts api_response.error.developer_message
  puts api_response.error.user_message
  exit
end

order = api_response.order

# puts order.inspect
# puts "\n\n"

# RefundReason may be required, but is optional by default.
# RefundReason may be a set list, or may be freeform. This is configured on the backend (secure.ultracart.com)
# by Navigating to Home -> Configuration -> Order Management -> Refund/Reject Reasons
# Warning: If this is a 2nd refund after an initial partial refund, be sure you account for the units and amount already refunded.
order.refund_reason = 'CustomerCancel'

item_amount_refunded = 0
order.items.each do |item|
  puts "Examining itemIndex #{item.item_index}"
  puts "Item ID: #{item.merchant_item_id}"

  # Fully refund all the birth stones.
  # I use casecmp because the item ids will most likely return uppercase. Just to be sure, always do
  # string insensitive comparisons on item ids.
  if item.merchant_item_id.casecmp('rivoli_14mm_birth') == 0
    # Refund reasons may be optional or required and must be on the configured list.
    # See https://secure.ultracart.com/merchant/configuration/refundReasonLoad.do
    # Home -> Configuration -> Order Management -> Refund/Reject Reasons
    item.refund_reason = 'DifferentItem'
    item.quantity_refunded = item.quantity
    item.total_refunded = item.total_cost_with_discount

    item_amount_refunded += item.total_cost_with_discount.value
    puts "birthstones refund amount: #{item.total_cost_with_discount.value}"
  end

  # Refund two of the opals
  if item.merchant_item_id.casecmp('rivoli_14mm_opal') == 0
    # Refund reasons may be optional or required and must be on the configured list.
    # See https://secure.ultracart.com/merchant/configuration/refundReasonLoad.do
    # Home -> Configuration -> Order Management -> Refund/Reject Reasons
    item.refund_reason = 'CustomerCancel'
    item.quantity_refunded = 2

    total_cost_of_two_opals = item.unit_cost_with_discount.value * 2
    item.total_refunded = UltracartClient::Currency.new(value: total_cost_of_two_opals, currency_code: 'USD')

    puts "opals refund amount: #{total_cost_of_two_opals}"
    item_amount_refunded += total_cost_of_two_opals
  end
end

tax_rate = order.summary.tax.value / order.summary.taxable_subtotal.value
tax_amount_refunded = item_amount_refunded * tax_rate
tax_refunded = UltracartClient::Currency.new(value: tax_amount_refunded, currency_code: 'USD')
order.summary.tax_refunded = tax_refunded

total_refund = tax_amount_refunded + item_amount_refunded
order.summary.total_refunded = UltracartClient::Currency.new(value: total_refund, currency_code: 'USD')

puts "Item Refund Amount: #{item_amount_refunded}"
puts "Calculated Tax Rate: #{tax_rate}"
puts "Tax Refund Amount: #{tax_amount_refunded}"
puts "Total Refund Amount: #{total_refund}"

reject_after_refund = false
skip_customer_notifications = true
auto_order_cancel = false # if this was an auto order, and they wanted to cancel it, set this flag to true.
# set manual_refund to true if the actual refund happened outside the system, and you just want a record of it.
# If UltraCart did not process this refund, manual_refund should be true.
manual_refund = true # IMPORTANT: Since my payment method is Purchase Order, I have to specify manual = true Or UltraCart will return a 400 Bad Request.
reverse_affiliate_transactions = true # for a full refund, the affiliate should not get credit, or should they?
issue_store_credit = false # if true, the customer would receive store credit instead of a return on their credit card.
auto_order_cancel_reason = nil

api_response = channel_partner_api.refund_channel_partner_order(order_id, order, {reject_after_refund => reject_after_refund,
  skip_customer_notifications => skip_customer_notifications, auto_order_cancel => auto_order_cancel,
  manual_refund => manual_refund, reverse_affiliate_transactions => reverse_affiliate_transactions,
  issue_store_credit => issue_store_credit, auto_order_cancel_reason => auto_order_cancel_reason, '_expand' => expansion})

error = api_response.error
updated_order = api_response.order
# verify the updated order contains all the desired refunds. verify that refunded total is equal to total.

# Note: The error 'Request to refund an invalid amount.' means you requested a total refund amount less than or equal to zero.
puts "Error:"
puts error.inspect
puts "\n\n\n\n\n"
puts "Order:"
puts updated_order.inspect