// I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
import { orderApi } from '../api.js';
// import { orderApi } from '../api';

import { WeightUomEnum, OrderItem, Currency, Weight, OrderProcessPaymentRequest, DuplicateOrderRequest } from 'ultracart_rest_api_v2_typescript';


// These are the steps for cloning an existing order and charging the customer for it.
// 1. duplicateOrder
// 2. updateOrder (if you wish to change any part of it)
// 3. processPayment to charge the customer.
//
// As a reminder, if you wish to create a new order from scratch, use the CheckoutApi.
// The OrderApi is for managing existing orders.


let expansion = "items";   
// for this example, we're going to change the items after we duplicate the order, so
// the only expansion properties we need are the items.
// See: https://www.ultracart.com/api/  for a list of all expansions.

// Step 1. Duplicate the order
let order_id_to_duplicate = 'DEMO-0009104436';

const duplicateOrderRequest: DuplicateOrderRequest = {
    orderId: order_id_to_duplicate,
    expand: expansion
};
let api_response = await orderApi.duplicateOrder(duplicateOrderRequest);
let new_order = api_response.order;

if(new_order === undefined){
    // handle this error in some fashion, because nothing will work if new order is undefined.
    new_order = {};

}


// Step 2. Update the items.  I will create a new items array and assign it to the order to remove the old ones completely.
let items = [];
let item: OrderItem = {};
item.merchant_item_id = 'simple_teapot';
item.quantity = 1;
item.description = "A lovely teapot";
item.distribution_center_code = 'DFLT'; // where is this item shipping out of?

let cost: Currency = {};
cost.currency_code = 'USD';
cost.value = 9.99;
item.cost = cost;

let weight: Weight = {};
weight.uom = WeightUomEnum.Oz;
weight.value = 6;
item.weight = weight;

items.push(item);
new_order.items = items;
let update_response = await orderApi.updateOrder({order: new_order, orderId: new_order.order_id!, expand: expansion});
let updated_order = update_response.order!;


// Step 3. process the payment.
// the request object below takes two optional arguments.
// The first is an amount if you wish to bill for an amount different from the order.  We do not.
// The second is card_verification_number_token, which is a token you can create by using our hosted fields to
// upload a CVV value.  This will create a token you may use here.  However, most merchants using the duplicate
// order method will be setting up an auto order for a customer.  Those will not make use of the CVV, so we're
// not including it here.  That is why the request object below is does not have any values set.
// For more info on hosted fields, see: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377775/UltraCart+Hosted+Credit+Card+Fields
let process_payment_request : OrderProcessPaymentRequest = {};
let payment_response = await orderApi.processPayment({orderId: new_order.order_id!, processPaymentRequest: process_payment_request});
let transaction_details = payment_response.payment_transaction!; // do whatever you wish with this.


console.log(updated_order);
console.log(transaction_details);