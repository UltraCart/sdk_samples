# Cancel a single item on an auto order, identified by the reference (original) order id
# that placed the auto order and the original item id on that order. This is useful when
# you know the original UltraCart order id rather than the auto_order_oid.

require_relative '../constants'
require 'ultracart_api'

auto_order_api = UltracartClient::AutoOrderApi.new_using_api_key(Constants::API_KEY)

reference_order_id = "DEMO-12345678" # the UltraCart order id that placed the auto order
original_item_id   = "ITEM001"       # the merchant item id on that original order
expand             = "items"         # see https://www.ultracart.com/api/#resource_auto_order.html for list

response = auto_order_api.cancel_auto_order_item_by_reference_order_id(
  reference_order_id,
  original_item_id,
  { _expand: expand }
)
auto_order = response.auto_order
puts auto_order.inspect
