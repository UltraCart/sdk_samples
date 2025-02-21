# Digital Item Retrieval Example
#
# Please Note!
# Digital Items are not normal items you sell on your site. They are digital files that you may add to
# a library and then attach to a normal item as an accessory or the main item itself.
# See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items

from ultracart.api_client import ApiException
from ultracart.apis import ItemApi
from samples import api_client
from item_functions import insert_sample_digital_item, delete_sample_digital_item

try:
    # Create a digital item to retrieve
    digital_item_oid = insert_sample_digital_item()

    # Get the item API and retrieve the digital item
    item_api = ItemApi(api_client())
    api_response = item_api.get_digital_item(digital_item_oid)
    digital_item = api_response.digital_item

    # Print the retrieved item
    print('The following item was retrieved via get_digital_item():')
    print(digital_item)

    # Clean up the sample digital item
    delete_sample_digital_item(digital_item_oid)

except ApiException as e:
    print('An ApiException occurred. Please review the following error:')
    print(e)  # Handle gracefully as noted in original comment
    exit(1)