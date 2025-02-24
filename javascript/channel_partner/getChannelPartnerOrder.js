import {channelPartnerApi} from '../api.js';

/**
 * ChannelPartnerApi.getChannelPartnerOrder() retrieves a single order for a given order_id.  It is identical to the
 * OrderApi.getOrder() call, but allows for a restricted permission set.  The channel partner api assumes
 * a tie to a Channel Partner and only allows retrieval of orders created by that Channel Partner.
 *
 * Possible Order Expansions:
 * - affiliate           - affiliate.ledger                    - auto_order
 * - billing             - channel_partner                     - checkout
 * - coupon              - customer_profile                    - digital_order
 * - edi                 - fraud_score                         - gift
 * - gift_certificate    - internal                            - item
 * - linked_shipment     - marketing                           - payment
 * - payment.transaction - quote                               - salesforce
 * - shipping            - shipping.tracking_number_details    - summary
 * - taxes
 */
export class GetChannelPartnerOrder {
    /**
     * Execute method to retrieve a channel partner order
     */
    static async execute() {
        console.log(`--- ${this.name} ---`);

        try {
            // The expansion variable instructs UltraCart how much information to return.
            // The order object is large and while it's easily manageable for a single order,
            // when querying thousands of orders, is useful to reduce payload size.
            // A channel partner will almost always query an order for the purpose of turning
            // around and submitting it to a refund call.
            const expand = "item,summary,shipping";

            // This order MUST be an order associated with this channel partner or you will receive a 400 Bad Request.
            const orderId = "DEMO-0009110366";

            // Retrieve the channel partner order
            const apiResponse = await new Promise((resolve, reject) => {
                channelPartnerApi.getChannelPartnerOrder(
                    orderId, {_expand: expand},
                    function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    }
                );
            });

            // Check for any errors in the API response
            if (apiResponse.error) {
                console.error(apiResponse.error.developer_message);
                console.error(apiResponse.error.user_message);
                process.exit(1);
            }

            // Extract and log the order
            const order = apiResponse.order;
            console.log(order);

        } catch (ex) {
            // Log details of the error
            if (ex instanceof Error) {
                console.error(`Error: ${ex.message}`);
                console.error(ex.stack);
            } else {
                console.error("An unknown error occurred");
            }
        }
    }
}
