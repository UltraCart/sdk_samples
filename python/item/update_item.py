from ultracart.apis import ItemApi
from ultracart.model.order_query import OrderQuery
from ultracart.model.order import Order
from ultracart.rest import ApiException
from pprint import pprint
from samples import api_client
from datetime import datetime, timedelta
import time

start_time = time.time()
api_instance = ItemApi(api_client())

iteration = 1
offset = 0
limit = 200
more_records_to_fetch = True
items = []


# This example queries multiple items from the system and then updates their mix-and-match group.
# Mix and Match groups are used to offer discounts for the purchase of one or more products from a configurable pool of
# products.  For this example, we'll use a Mix and Match group named 'test', which offers a 10% discount if any one
# item is purchased from the pool
def get_item_chunk():
    expansion = 'pricing'

    # The real devil in the getItem calls is the expansion, making sure you return everything you need without
    # returning everything since these objects are extremely large.
    # These are the possible expansion values.
    #
    # accounting                      amember                     auto_order                      auto_order.steps
    # ccbill                          channel_partner_mappings    chargeback                      checkout
    # content                         content.assignments         content.attributes              content.multimedia
    # content.multimedia.thumbnails   digital_delivery            ebay                            email_notifications
    # enrollment123                   gift_certificate            google_product_search           kit_definition
    # identifiers                     instant_payment_notifications   internal                    options
    # payment_processing              physical                    pricing                         pricing.tiers
    # realtime_pricing                related                     reporting                       restriction
    # reviews                         salesforce                  shipping                        shipping.cases
    # tax                             third_party_email_marketing variations                      wishlist_member
    # shipping.destination_markups
    # shipping.destination_restrictions
    # shipping.distribution_centers
    # shipping.methods
    # shipping.package_requirements
    #

    api_response = api_instance.get_items(limit=limit, offset=offset, expand=expansion)
    if api_response.items is not None:
        return api_response.items
    return []


$items = [];

$iteration = 1;
$offset = 0;
$limit = 200;
$more_records_to_fetch = true;

try {
    while ($more_records_to_fetch) {

        echo "executing iteration " . $iteration . '<br>';

        $chunk_of_items = getItemChunk($item_api, $offset, $limit);
        $orders = array_merge($items, $chunk_of_items);
        $offset = $offset + $limit;
        $more_records_to_fetch = count($chunk_of_items) == $limit;
        $iteration++;
    }
} catch (ApiException $e) {
    echo 'ApiException occurred on iteration ' . $iteration;
    var_dump($e);
    die(1);
}


// this will be verbose...
var_dump($items);
