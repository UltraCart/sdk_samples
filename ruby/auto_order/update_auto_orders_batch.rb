require 'ultracart_api'
require_relative '../constants'

# This method allows for updating multiple auto orders.
# Warning: Take great care editing auto orders.  They are complex.
# Sometimes you must change the original_order to affect the auto_order.  If you have questions about what fields
# to update to achieve your desired change, contact UltraCart support.  Better to ask and get it right than to
# make a bad assumption and corrupt a thousand auto orders.  UltraCart support is ready to assist.

auto_order_api = UltracartClient::AutoOrderApi.new_using_api_key(Constants::API_KEY)

# The _async parameter is what it seems.  True if async.
# The max records allowed depends on the async flag.  Synch max is 20, Asynch max is 100.

# if true, success returns back a 204 No Content.  False returns back the updated orders.
async = true

# since we're async, nothing is returned, so we don't care about expansions.
# If you are doing a synchronous operation, then set your expand appropriately.  set get_auto_orders
# sample for expansion samples.
expand = nil

# mostly used for UI, not needed for a pure scripting operation.
placeholders = false

# TODO: This should be an array of auto orders that have been updated.  See any get_auto_orders method for retrieval.
auto_orders = []

auto_orders_request = UltracartClient::AutoOrdersRequest.new
auto_orders_request.auto_orders = auto_orders

opts = {
  _expand: expand,
  _placeholders: placeholders,
  _async: async
}

api_response = auto_order_api.update_auto_orders_batch(auto_orders_request, opts)

# something went wrong if we have a response.
puts api_response.inspect unless api_response.nil?