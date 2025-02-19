<?php

ini_set('display_errors', 1);

/*
 This is a helper function for call centers to calculate the shipping cost on an order.  In a typical flow, the call center
 will collect all the shipping information and items being purchased into a ChannelPartnerOrder object.
 They will then call this method, passing in the order object.  The response will contain the shipping estimates
 that the call center can present to the customer.  Once the customer selects a particulate estimate,
 they can then plug that cost into their call center application and complete the order.

 Possible Errors:
 Using an API key that is not tied to a channel partner: "This API Key does not have permission to interact with channel partner orders.  Please review your Channel Partner configuration."
 Order has invalid channel partner code: "Invalid channel partner code"
 Order has no items: "null order.items passed." or "order.items array contains a null entry."
 Order has no channel partner order id: "order.channelPartnerOrderId must be specified."
 Order channel partner order id is a duplicate:  "order.channelPartnerOrderId [XYZ] already used."
 Channel Partner is inactive: "partner is inactive."


 */


use ultracart\v2\api\ChannelPartnerApi;
use ultracart\v2\models\ChannelPartnerOrder;
use ultracart\v2\models\ChannelPartnerOrderItem;
use ultracart\v2\models\ChannelPartnerOrderItemOption;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$channel_partner_api = ChannelPartnerApi::usingApiKey(Constants::CHANNEL_PARTNER_API_KEY);

$order = new ChannelPartnerOrder();
$order->setChannelPartnerOrderId("widget-1245-abc-1");
$order->setCoupons(["10OFF"]);
// DeliveryDate will impact shipping estimates if there is a delivery deadline.
// $order->setDeliveryDate(date('c', strtotime('+14 days')));

$item = new ChannelPartnerOrderItem();
// $item->setArbitraryUnitCost(9.99);
// $item->setAutoOrderLastRebillDts(date('c', strtotime('-30 days')));
// $item->setAutoOrderSchedule("Weekly");
$item->setMerchantItemId("shirt");

$sizeOption = new ChannelPartnerOrderItemOption();
$sizeOption->setName("Size");
$sizeOption->setValue("Small");

$colorOption = new ChannelPartnerOrderItemOption();
$colorOption->setName("Color");
$colorOption->setValue("Orange");

$item->setOptions([$sizeOption, $colorOption]);
$item->setQuantity(1);
$item->setUpsell(false);

$order->setItems([$item]);

// $order->setShipOnDate(date('c', strtotime('+7 days')));
$order->setShipToResidential(true);
$order->setShiptoAddress1("55 Main Street");
$order->setShiptoAddress2("Suite 202");
$order->setShiptoCity("Duluth");
$order->setShiptoCompany("Widgets Inc");
$order->setShiptoCountryCode("US");
$order->setShiptoDayPhone("6785552323");
$order->setShiptoEveningPhone("7703334444");
$order->setShiptoFirstName("Sally");
$order->setShiptoLastName("McGonkyDee");
$order->setShiptoPostalCode("30097");
$order->setShiptoStateRegion("GA");
$order->setShiptoTitle("Director");


$api_response = $channel_partner_api->estimateShippingForChannelPartnerOrder($order);
$estimates = $api_response->getEstimates();

// TODO: Apply one estimate shipping method (name) and cost to your channel partner order.

echo '<html lang="en"><body><pre>';
foreach ($estimates as $estimate) {
    var_dump($estimate);
}
echo '</pre></body></html>';
