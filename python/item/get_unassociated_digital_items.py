from ultracart.apis import ItemApi
from samples import api_client
from item_functions import insert_sample_digital_item
from ultracart.exceptions import ApiException

"""
Please Note!
Digital Items are not normal items you sell on your site.  They are digital files that you may add to
a library and then attach to a normal item as an accessory or the main item itself.
See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items

Retrieves a group of digital items (file information) from the account that are not yet associated with any
actual items.  If no parameters are specified, all digital items will be returned.  Be aware that these are
not normal items that can be added to a shopping cart. Rather, they are digital files that may be associated
with normal items.  You will need to make multiple API calls in order to retrieve the entire result set since
this API performs result set pagination.

Default sort order: original_filename
Possible sort orders: original_filename, description, file_size
"""

try:
    # Create an unassociated digital item
    digital_item_oid = insert_sample_digital_item()

    # Initialize Item API
    item_api = ItemApi(api_client())

    # Set up parameters for retrieving unassociated digital items
    limit = 100
    offset = 0
    since = None  # digital items do not use since.  leave as None
    sort = None  # if None, use default of original_filename
    expand = None  # digital items have no expansion.  leave as None
    placeholders = None  # digital items have no placeholders. leave as None

    # Retrieve unassociated digital items
    api_response = item_api.get_unassociated_digital_items(
        limit=limit,
        offset=offset,
        since=since,
        sort=sort,
        expand=expand,
        placeholders=placeholders
    )

    # Extract digital items from the response
    digital_items = api_response.digital_items

    # Print retrieved digital items
    print('The following items were retrieved via get_unassociated_digital_items():')
    for digital_item in digital_items:
        print(digital_item)

except ApiException as e:
    print('An ApiException occurred. Please review the following error:')
    print(e)
    exit(1)