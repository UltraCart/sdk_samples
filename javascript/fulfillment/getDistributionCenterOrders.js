import { fulfillmentApi } from '../api.js';

export class GetDistributionCenterOrders {
    /*
        getDistributionCenterOrders accepts a distribution center code and returns back up to 100 orders that need shipping.
        There is NO pagination with this method call. Once you receive the orders, you should insert them into your
        system, and acknowledge them via the acknowledgeOrders call. After you acknowledge the orders, subsequent calls
        to getDistributionCenterOrders will return another batch of 100 orders.

        The orders that are returned contain only items for THIS distribution center and are by default completely expanded
        with billing, channel_partner, checkout, coupons, customer_profile, edi, gift, gift_certificate, internal,
        items, payment, shipping, summary, taxes

        You will need the distribution center (DC) code. UltraCart allows for multiple DC and the code is a
        unique short string you assign to a DC as an easy mnemonic.

        For more information about UltraCart distribution centers, please see:
        https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

        If you do not know your DC code, query a list of all DC and print them out.
        DistributionCentersResponse result = fulfillmentApi.GetDistributionCenters();
        Console.WriteLine(result);
    */
    static async Execute() {
        try {
            const acknowledgedOrders = [];
            const distributionCenterCode = "RAMI";

            const result = await new Promise((resolve, reject) => {
                fulfillmentApi.getDistributionCenterOrders(distributionCenterCode, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            const orders = result.orders || [];

            // Process each order
            for (const order of orders) {
                console.log(order);
                // TODO: do something useful with this order, like adding it to your shipping queue.
                if (order.order_id) {
                    acknowledgedOrders.push(order.order_id);
                }
            }

            // TODO: once you've securely and completely received it into your system, acknowledge the order.
            if (acknowledgedOrders.length > 0) {
                await new Promise((resolve, reject) => {
                    fulfillmentApi.acknowledgeOrders(distributionCenterCode, acknowledgedOrders, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data, response);
                        }
                    });
                });
            }

            // After acknowledging orders, you should call getDistributionCenterOrders again until you receive zero orders to ship.
            console.log("done");
        } catch (e) {
            // update inventory failed. examine the reason.
            console.error(`Exception when calling FulfillmentApi.GetDistributionCenterOrders: ${e instanceof Error ? e.message : e}`);
            process.exit(1);
        }
    }
}