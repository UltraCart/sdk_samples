var ucApi = require('ultra_cart_rest_api_v2');
const { apiClient } = require('../api.js');
var orderApi = new ucApi.OrderApi(apiClient);


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
orderApi.duplicateOrder(order_id_to_duplicate, {_expand: expansion}, function(error, data, response){
    console.log(data);
    let newOrder = data.order;

    // // Step 2. Update the items.  I will create a new items array and assign it to the order to remove the old ones completely.
    let items = [];
    let item = new ucApi.OrderItem();
    item.merchant_item_id = 'simple_teapot';
    item.quantity = 1;
    item.description = "A lovely teapot";
    item.distribution_center_code = 'DFLT'; // where is this item shipping out of?

    let cost = new ucApi.Currency();
    cost.currency_code = 'USD';
    cost.value = 9.99;
    item.cost = cost;

    let weight = new ucApi.Weight();
    weight.uom = 'OZ';
    weight.value = 6;
    item.weight = weight;

    items.push(item);
    newOrder.items = items;
    orderApi.updateOrder(newOrder, newOrder.order_id, {_expand: expansion}, function(error, updateOrderData, response){
        let updatedOrder = updateOrderData.order;

        // Step 3. process the payment.
        // the request object below takes two optional arguments.
        // The first is an amount if you wish to bill for an amount different from the order.  We do not.
        // The second is card_verification_number_token, which is a token you can create by using our hosted fields to
        // upload a CVV value.  This will create a token you may use here.  However, most merchants using the duplicate
        // order method will be setting up an auto order for a customer.  Those will not make use of the CVV, so we're
        // not including it here.  That is why the request object below is does not have any values set.
        // For more info on hosted fields, see: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377775/UltraCart+Hosted+Credit+Card+Fields
        let processPaymentRequest = new ucApi.OrderProcessPaymentRequest();
        orderApi.processPayment(newOrder.order_id, processPaymentRequest, function(error, processPaymentData, response){
            let transactionDetails = processPaymentData.payment_transaction;
            console.log(updatedOrder);
            console.log(transactionDetails);

        });  // end of processPayment
    }); // end of updateOrder call
}); // end of duplicateOrder call
