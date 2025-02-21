from item_functions import insert_sample_item, delete_sample_item
from ultracart.exceptions import ApiException

try:
    item_id = insert_sample_item()
    delete_sample_item(item_id)

except ApiException as e:
    print('An ApiException occurred. Please review the following error:')
    print(e)
    exit(1)