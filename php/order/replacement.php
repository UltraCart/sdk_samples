<?php /** @noinspection DuplicatedCode */

require_once '../vendor/autoload.php';
require_once '../constants.php';

/*
 * The use-case for replacement() is to create another order for a customer to replace the items of the existing
 * order.  For example, a merchant is selling perishable goods and the goods arrive late, spoiled.  replacement()
 * helps to create another order to send more goods to the customer.
 *
 * You MUST supply the items you desire in the replacement order.  This is done with the OrderReplacement.items field.
 * All options are displayed below including whether to charge the customer for this replacement order or not.
 *
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\models\OrderReplacement;
use ultracart\v2\models\OrderReplacementItem;

$order_api = OrderApi::usingApiKey(Constants::API_KEY);

// Step 1. Replace the order
$order_id_to_replace = 'DEMO-0009104436';
$replacement_options = new OrderReplacement();
$replacement_options->setOriginalOrderId($order_id_to_replace);

$items = array();

$item1 = new OrderReplacementItem();
$item1->setMerchantItemId('TSHIRT');
$item1->setQuantity(1);
// $item1->setArbitraryUnitCost(9.99);
$items[] = $item1;

$item2 = new OrderReplacementItem();
$item2->setMerchantItemId('BONE');
$item2->setQuantity(2);
$items[] = $item2;

$replacement_options->setItems($items);

// $replacement_options->getShippingMethod('FedEx: Ground');
$replacement_options->setImmediateCharge(true);
$replacement_options->setSkipPayment(true);
$replacement_options->setFree(true);
$replacement_options->setCustomField1('Whatever');
$replacement_options->setCustomField4('More Whatever');
$replacement_options->setAdditionalMerchantNotesNewOrder('Replacement order for spoiled ice cream');
$replacement_options->setAdditionalMerchantNotesOriginalOrder('This order was replaced.');

$api_response = $order_api->replacement($order_id_to_replace, $replacement_options);


echo '<html lang="en"><body><pre>';
echo 'Replacement Order: ' . $api_response->getOrderId();
echo 'Success flag: ' . $api_response->getSuccessful();
echo '</pre></body></html>';