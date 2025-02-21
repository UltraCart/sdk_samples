# Retrieve a list of item inventories.
# This method may be called once every 15 minutes.  More than that will result in a 429 response.

from ultracart.apis import ItemApi
from ultracart.api_client import ApiException
from samples import api_client

try:
    # Create the Item API instance
    item_api = ItemApi(api_client())

    # Get the inventory snapshot
    api_response = item_api.get_inventory_snapshot()
    inventories = api_response.inventories

    # Iterate and print inventories
    for inventory in inventories:
        print(inventory)

except ApiException as e:
    print('An ApiException occurred. Please review the following error:')
    print(e)  # Handle gracefully as noted in original comment
    exit(1)