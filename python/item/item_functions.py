import random

from ultracart.apis import ItemApi
from ultracart.model.item_digital_item import ItemDigitalItem

from samples import api_client
from ultracart.model.item import Item
from ultracart.model.item_pricing import ItemPricing
from ultracart.model.item_content_multimedia import ItemContentMultimedia
from ultracart.model.item_content import ItemContent
from ultracart.model.item_shipping import ItemShipping
from ultracart.model.item_shipping_distribution_center import ItemShippingDistributionCenter

from pprint import pprint

## In an effort to be repeatable, this script will delete the item created.
## If you wish to inspect the created item in the backend, just comment out delete call

##
## @return string the newly created item id
## @throws ApiException
##
def insert_sample_item():
    api_instance = ItemApi(api_client())

    l = ['A','B','C', 'D', 'E', "F", 'G', 'H']
    random.shuffle(l)
    shuffled = ''.join(l)
    item_id = 'sample_' + shuffled
    print(f"insert_sample_item will attempt to create item {item_id}.")

    new_item = Item()
    new_item.merchant_item_id = item_id

    pricing = ItemPricing()
    pricing.cost = 9.99
    new_item.pricing = pricing
    new_item.description = f"Sample description for item {item_id}"

    multimedia = ItemContentMultimedia()
    multimedia.url = 'https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png'
    multimedia.code = 'default' ## <-- use 'default' to make this the default item.
    multimedia.description = 'Some random image i nabbed from wikipedia'

    content = ItemContent()
    content.multimedia = [multimedia] ## <- notice this is an array
    new_item.content = content

    shipping = ItemShipping()
    shipping.track_inventory = True

    dc = ItemShippingDistributionCenter()
    dc.distribution_center_code = 'DFLT'
    dc.inventory_level = 20.0
    dc.handles = True

    shipping.distribution_centers = [dc]
    new_item.shipping = shipping

    # expand = 'content.multimedia'; ## I want to see the multimedia returned on the newly created object.
    expand = 'all'

    print('insertItem request object follows:')
    pprint(new_item)
    api_response = api_instance.insert_item(item=new_item, expand=expand)
    print('insertItem response object follows:')
    pprint(api_response)

    return item_id



##
## * @param $item_id string item to be deleted
## * @return void
## * @throws ApiException
##
def delete_sample_item(item_id):
    api_instance = ItemApi(api_client())

    print('deleteItem takes the item oid (internal unique identifier), so we need to retrieve the item first to delete')
    print(f"attempting to retrieve the item object for item id {item_id}")
    expand = '' ## I don't need extra fields here, just the base item will contain the oid
    api_response = api_instance.get_item_by_merchant_item_id(merchant_item_id=item_id, expand=expand, placeholders=False)
    item = api_response.item
    print('The following object was retrieved:')
    pprint(item)
    merchant_item_oid = item.merchant_item_oid

    print(f"calling deleteItem('{merchant_item_oid}')")
    api_instance.delete_item(merchant_item_oid)



##
## * @return int the digital item oid for the newly created item
## * @throws ApiException
##
def insert_sample_digital_item()

    image_url = 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Earth_%2816530938850%29.jpg' # picture of the earth

    digital_item = ItemDigitalItem()
    digital_item.import_from_url = image_url
    digital_item.description = "The Earth"
    digital_item.click_wrap_agreement = "By purchasing this item, you agree that it is Earth"

    print('insertDigitalItem request object follows:')
    pprint(digital_item)

    api_instance = ItemApi(api_client())
    api_response = api_instance.insert_digital_item(digital_item)

    print('insertDigitalItem response object follows:')
    pprint(api_response)

    return api_response.digital_item.digital_item_oid

##
## * @param $digital_item_oid int the primary key of the digital item to be deleted.
## * @return void
## * @throws ApiException
##
def delete_sample_digital_item(digital_item_oid):
    api_instance = ItemApi(api_client())
    print(f"calling deleteItem('{digital_item_oid}')")
    api_instance.delete_digital_item(digital_item_oid)

