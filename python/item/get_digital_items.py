from ultracart.apis import ItemApi
from samples import api_client
from item_functions import insert_sample_digital_item

try:
    """
    Please Note!
    Digital Items are not normal items you sell on your site.  They are digital files that you may add to
    a library and then attach to a normal item as an accessory or the main item itself.
    See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
    """

    # Create a digital item to get an item
    digital_item_oid = insert_sample_digital_item()

    # Create Item API client
    item_api = ItemApi(api_client())

    # Set parameters for getDigitalItems
    limit = 100
    offset = 0
    since = None  # digital items do not use since. leave as None.
    sort = None  # if None, use default of original_filename
    expand = None  # digital items have no expansion. leave as None. this value is ignored
    placeholders = None  # digital items have no placeholders. leave as None.

    # Retrieve digital items
    api_response = item_api.get_digital_items(limit=limit, offset=offset, since=since,
                                              sort=sort, expand=expand,
                                              placeholders=placeholders)
    digital_items = api_response.get_digital_items()  # assuming this succeeded

    print('The following items were retrieved via get_digital_items():')
    for digital_item in digital_items:
        print(digital_item)

except Exception as e:
    print('An exception occurred. Please review the following error:')
    print(e)
    raise