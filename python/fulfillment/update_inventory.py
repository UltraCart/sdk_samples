from ultracart.apis import FulfillmentApi
from ultracart.models import FulfillmentInventory
from samples import api_client
from ultracart.rest import ApiException

"""
updateInventory is a simple means of updating UltraCart inventory for one or more items (500 max per call)
You will need the distribution center (DC) code. UltraCart allows for multiple DC and the code is a
unique short string you assign to a DC as an easy mnemonic.

For more information about UltraCart distribution centers, please see:
https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

If you do not know your DC code, query a list of all DC and print them out:
result = fulfillment_api.get_distribution_centers()
print(result)

Possible Errors:
More than 500 items provided -> "inventories can not contain more than 500 records at a time"
"""

fulfillment_api = FulfillmentApi(api_client())
distribution_center_code = 'RAMI'

sku = '9780982021361'
quantity = 9
first_inventory = FulfillmentInventory()
first_inventory.set_item_id(sku)
first_inventory.set_quantity(quantity)
inventory_updates = [first_inventory]  # for this example, we're only updating one item.

print(inventory_updates)

try:
    # limit is 500 inventory updates at a time. batch them if you're going large.
    fulfillment_api.update_inventory(distribution_center_code, inventory_updates)
    print("done")
except ApiException as e:
    # update inventory failed. examine the reason.
    print(f'Exception when calling FulfillmentApi->update_inventory: {e}')
    exit(1)