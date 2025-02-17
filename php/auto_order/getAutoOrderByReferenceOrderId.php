<?php

ini_set('display_errors', 1);

/*
 * This example illustrates how to query an auto order when you know the original order id.
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';


$auto_order_api = Samples::getAutoOrderApi();

/**
 * These are the possible expansion values for auto orders.  This list is taken from www.ultracart.com/api/
 * and may become stale. Please review the master website when in doubt.
 * items
 * items.future_schedules
 * items.sample_schedule
 * original_order
 * original_order.affiliate
 * original_order.affiliate.ledger
 * original_order.auto_order
 * original_order.billing
 * original_order.buysafe
 * original_order.channel_partner
 * original_order.checkout
 * original_order.coupon
 * original_order.customer_profile
 * original_order.digital_order
 * original_order.edi
 * original_order.fraud_score
 * original_order.gift
 * original_order.gift_certificate
 * original_order.internal
 * original_order.item
 * original_order.linked_shipment
 * original_order.marketing
 * original_order.payment
 * original_order.payment.transaction
 * original_order.quote
 * original_order.salesforce
 * original_order.shipping
 * original_order.summary
 * original_order.taxes
 * rebill_orders
 * rebill_orders.affiliate
 * rebill_orders.affiliate.ledger
 * rebill_orders.auto_order
 * rebill_orders.billing
 * rebill_orders.buysafe
 * rebill_orders.channel_partner
 * rebill_orders.checkout
 * rebill_orders.coupon
 * rebill_orders.customer_profile
 * rebill_orders.digital_order
 * rebill_orders.edi
 * rebill_orders.fraud_score
 * rebill_orders.gift
 * rebill_orders.gift_certificate
 * rebill_orders.internal
 * rebill_orders.item
 * rebill_orders.linked_shipment
 * rebill_orders.marketing
 * rebill_orders.payment
 * rebill_orders.payment.transaction
 * rebill_orders.quote
 * rebill_orders.salesforce
 * rebill_orders.shipping
 * rebill_orders.summary
 * rebill_orders.taxes
 */
$expand = "items,items.future_schedules,original_order,rebill_orders"; // contact us if you're unsure what you need
$original_order_id = "DEMO-12345678";
$api_response = $auto_order_api->getAutoOrderByReferenceOrderId($original_order_id, $expand);
$auto_order = $api_response->getAutoOrder();

// this will be verbose...
var_dump($auto_order);
