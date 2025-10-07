from ultracart import ApiException
from ultracart.apis import OrderApi
from ultracart.models import OrderReplacement, OrderReplacementItem
from samples import api_client


'''
 * The use-case for replacement() is to create another order for a customer to replace the items of the existing
 * order.  For example, a merchant is selling perishable goods and the goods arrive late, spoiled.  replacement()
 * helps to create another order to send more goods to the customer.
 *
 * You MUST supply the items you desire in the replacement order.  This is done with the OrderReplacement.items field.
 * All options are displayed below including whether to charge the customer for this replacement order or not.
'''

# Initialize the Order API with the API key
order_api = OrderApi(api_client())

# Step 1. Replace the order
order_id_to_replace = 'DEMO-0009104436'
replacement_options = OrderReplacement()
replacement_options.original_order_id = order_id_to_replace

# Create replacement items
items = []

item1 = OrderReplacementItem()
item1.merchant_item_id = 'TSHIRT'
item1.quantity = 1.0
# $item1->setArbitraryUnitCost(9.99);  # Optional: Set cost if needed
items.append(item1)

item2 = OrderReplacementItem()
item2.merchant_item_id = 'BONE'
item2.quantity = 2.0
items.append(item2)

replacement_options.items = items

# Optional: Set various replacement options
replacement_options.immediate_charge = True
replacement_options.skip_payment = True
replacement_options.free = True
replacement_options.custom_field_1 = 'Whatever'
replacement_options.custom_field_4 = 'More Whatever'
replacement_options.additional_merchant_notes_new_order = 'Replacement order for spoiled ice cream'
replacement_options.additional_merchant_notes_original_order = 'This order was replaced.'

# Step 2. Call the replacement API
try:
    api_response = order_api.replacement(order_id_to_replace, replacement_options)
except ApiException as e:
    print(f"Exception when calling OrderApi->replacement: {e}")
    exit()

# Output the replacement order details
print(f"Replacement Order: {api_response.order_id}")
print(f"Success flag: {api_response.successful}")

