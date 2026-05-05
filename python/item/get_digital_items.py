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
    # TODO - uncomment this if you have no digital items in your account.  but this can only be run once, after which you'll get a duplicate image error
    # digital_item_oid = insert_sample_digital_item()

    # Create Item API client
    item_api = ItemApi(api_client())

    # Set parameters for getDigitalItems
    limit = 100
    offset = 0

    # Retrieve digital items
    api_response = item_api.get_digital_items(limit=limit, offset=offset)
    digital_items = api_response.digital_items  # assuming this succeeded

    print('The following items were retrieved via get_digital_items():')
    for digital_item in digital_items:
        print(digital_item)

except Exception as e:
    print('An exception occurred. Please review the following error:')
    print(e)
    raise