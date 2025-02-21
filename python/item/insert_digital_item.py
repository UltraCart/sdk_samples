from ultracart.apis import ItemApi
from samples import api_client
from item_functions import insert_sample_digital_item, delete_sample_digital_item
from ultracart.exceptions import ApiException

try:
    # Create and then delete a sample digital item
    digital_item_oid = insert_sample_digital_item()
    delete_sample_digital_item(digital_item_oid)

except ApiException as e:
    print('An ApiException occurred. Please review the following error:')
    print(e)
    exit(1)