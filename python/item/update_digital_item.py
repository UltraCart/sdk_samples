from ultracart.apis import ItemApi
from samples import api_client
from item_functions import insert_sample_digital_item, delete_sample_digital_item
from ultracart.exceptions import ApiException

try:
    digital_item_oid = insert_sample_digital_item()

    item_api = ItemApi(api_client())
    api_response = item_api.get_digital_item(digital_item_oid)
    digital_item = api_response.digital_item

    digital_item.description = "I have updated the description to this sentence."
    digital_item.click_wrap_agreement = "You hereby agree that the earth is round. No debate."

    item_api.update_digital_item(digital_item_oid, digital_item)

    delete_sample_digital_item(digital_item_oid)

except ApiException as e:
    print('An ApiException occurred. Please review the following error:')
    print(e)
    exit(1)