from item_functions import insert_sample_item, delete_sample_item
from ultracart.rest import ApiException

try:

    item_id = insert_sample_item()
    delete_sample_item(item_id)

except ApiException as e:
    print("Exception when inserting or deleting an item: %s\n" % e)