# OrderApi.delete_order() will do just that.  It will delete an order.
# You might find it more useful to reject an order rather than delete it in order to leave an audit trail.
# However, deleting test orders will be useful to keep your order history tidy.  Still, any order
# may be deleted.

require_relative '../constants'
require 'ultracart_api'

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)

order_id = 'DEMO-0008104390'
order_api.delete_order(order_id)
puts 'Order was deleted successfully.'