import {orderApi} from '../api.js';

/**
 * This method is useful when you need to query a defined set of orders and would like to avoid querying them
 * one at a time.
 */
export async function execute() {
    // The expansion variable instructs UltraCart how much information to return.
    // see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
    /*
    Possible Order Expansions:
    affiliate           affiliate.ledger                    auto_order
    billing             channel_partner                     checkout
    coupon              customer_profile                    digital_order
    edi                 fraud_score                         gift
    gift_certificate    internal                            item
    linked_shipment     marketing                           payment
    payment.transaction quote                               salesforce
    shipping            shipping.tracking_number_details    summary
    taxes
    */
    const expansion = "item,summary,billing,shipping,shipping.tracking_number_details";

    const orderBatch = {
        order_ids: ["DEMO-0009104390", "DEMO-0009104391", "DEMO-0009104392"]
    };

    try {
        const apiResponse = await new Promise((resolve, reject) => {
            orderApi.getOrdersBatch(
                orderBatch,
                {_expand: expansion}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        if (apiResponse.error) {
            console.error(apiResponse.error.developer_message);
            console.error(apiResponse.error.user_message);
            process.exit(1);
        }

        const orders = apiResponse.orders || [];

        if (orders.length === 0) {
            console.error("There were no orders returned by this query.");
        }

        // do something with the orders. for this example, we're just accessing many properties as illustration.
        for (const order of orders) {
            const summary = order.summary;
            const actualShippingCost = summary?.actual_shipping?.localized ?? 0;

            const currentStage = order.current_stage;
            const sAddr = order.shipping;
            const trackingNumbers = sAddr?.tracking_numbers || [];

            for (const trackingNumber of trackingNumbers) {
                // do something with tracking number here.
            }

            // Here's how to access the shipping information. Do something with the variables.
            const sfname = order.shipping?.first_name;
            const slname = order.shipping?.last_name;
            const saddress1 = order.shipping?.address1;
            const saddress2 = order.shipping?.address2;
            const scity = order.shipping?.city;
            const sregion = order.shipping?.state_region;
            const sccode = order.shipping?.country_code;
            const spcode = order.shipping?.postal_code;
            const sdayphone = order.shipping?.day_phone;
            const shippingMethod = order.shipping?.shipping_method;

            // Here's how to access the billing information. Do something with the variables.
            const billingAddress1 = order.billing?.address1;
            const billingAddress2 = order.billing?.address2;
            const billingCity = order.billing?.city;
            const billingStateRegion = order.billing?.state_region;
            const billingCountryCode = order.billing?.country_code;
            const billingPostalCode = order.billing?.postal_code;
            const email = order.billing?.email; // email is located on the billing object.

            // here is how to access the items
            const items = order.items || [];
            for (const item of items) {
                const qty = item.quantity;
                const itemId = item.merchant_item_id;
                const description = item.description;
                const cost = item.cost?.localized;
                const costFormatted = item.cost?.localized_formatted; // cost with symbols.
            }
        }

        // this could get verbose depending on the size of your batch ...
        for (const order of orders) {
            console.log(JSON.stringify(order, null, 2));
        }
    } catch (error) {
        console.error('Error fetching orders batch:', error);
    }
}