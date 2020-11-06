<?php

declare(strict_types=1);

use GuzzleHttp\Client;
use ultracart\v2\api\OrderApi;
use ultracart\v2\Configuration;
use ultracart\v2\HeaderSelector;
use ultracart\v2\models\Currency;

require_once "vendor/autoload.php";

$apiKey = '0a4842d0f198c801706475cf15380100b575d4eb25ddeb01706475cf15380100';

Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $apiKey);

$client   = new Client(['verify' => false, 'debug' => false]);
$config   = Configuration::getDefaultConfiguration();
$orderApi = new OrderApi($client, $config, new HeaderSelector());

$expansion = 'item,payment,shipping,summary,taxes';

$orderId = 'DEMO-0009104367';

//Get the order from Ultracart
$orderResponse = $orderApi->getOrder($orderId, "billing,shipping,item,payment,payment.transaction,shipping,summary,taxes");

$order = $orderResponse->getOrder();

$refundedAmount = 0;

//set the refund amount for each item purchased
foreach ($order->getItems() as $orderItem) {

    $totalCostWithDiscount = $orderItem->getTotalCostWithDiscount();
    $orderItem->setTotalRefunded($totalCostWithDiscount);
    $orderItem->setQuantityRefunded(0);

    $refundedAmount += $totalCostWithDiscount->getValue();
}

//refund taxes
if ($order->getTaxes() !== null && $order->getTaxes()->getTaxRate() !== null) {

    $order->getSummary()->setTaxRefunded($order->getSummary()->getTax());
    $refundedAmount += $order->getSummary()->getTax()->getValue();
}

$shippingHandlingTotal = $order->getSummary()->getShippingHandlingTotal();

//refund shipping
if ($shippingHandlingTotal->getValue() > 0) {

    $order->getSummary()->setShippingHandlingRefunded($shippingHandlingTotal);
    $refundedAmount += $shippingHandlingTotal->getValue();
}

//set the refunded subtotal
$order->getSummary()->setSubtotalDiscountRefunded($order->getSummary()->getSubtotalDiscount());

$order->getSummary()->setSubTotalRefunded($order->getSummary()->getSubtotal());

$totalRefunded = (new Currency())->setValue($refundedAmount);

//set the refunded total amount
$order->getSummary()->setTotalRefunded($totalRefunded);


//$order                          = new Order(); // \ultracart\v2\models\Order | Order to refund
$reject_after_refund            = false; // bool | Reject order after refund
$skip_customer_notification     = false; // bool | Skip customer email notification
$auto_order_cancel              = false; // bool | Cancel associated auto orders
$manual_refund                  = false; // bool | Consider a manual refund done externally
$reverse_affiliate_transactions = true; // bool | Reverse affiliate transactions

try {
    $result = $orderApi->refundOrder(
        $order,
        $orderId,
        $reject_after_refund,
        $skip_customer_notification,
        $auto_order_cancel,
        $manual_refund,
        $reverse_affiliate_transactions,
        $expansion
    );
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling OrderApi->refundOrder: ', $e->getMessage(), PHP_EOL;
}

