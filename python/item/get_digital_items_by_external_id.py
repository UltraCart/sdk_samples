import uuid
from ultracart.apis import ItemApi
from samples import api_client
from item_functions import insert_sample_digital_item, delete_sample_digital_item

try:
    """
    Please Note!
    Digital Items are not normal items you sell on your site.  They are digital files that you may add to
    a library and then attach to a normal item as an accessory or the main item itself.
    See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
    """

    # Generate a unique external ID
    external_id = str(uuid.uuid4())
    print(f'My external id is {external_id}')

    # Create digital item with a specific external id I can later use
    digital_item_oid = insert_sample_digital_item(external_id)

    # Create Item API client
    item_api = ItemApi(api_client())

    # Retrieve digital items by external ID
    api_response = item_api.get_digital_items_by_external_id(external_id)
    digital_items = api_response.get_digital_items()  # assuming this succeeded

    print('The following item was retrieved via get_digital_items_by_external_id():')
    print(digital_items)

    # Delete the sample digital item
    delete_sample_digital_item(digital_item_oid)

except Exception as e:
    print('An exception occurred. Please review the following error:')
    print(e)
    raise