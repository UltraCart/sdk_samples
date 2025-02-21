# Digital item operations sample script

from ultracart.api_client import ApiException
from item_functions import insert_sample_digital_item, delete_sample_digital_item

try:
    digital_item_oid = insert_sample_digital_item()
    delete_sample_digital_item(digital_item_oid)

except ApiException as e:
    print('An ApiException occurred. Please review the following error:')
    print(e)  # Handle gracefully as noted in original comment
    exit(1)