import {
    Order, OrderResponse
} from 'ultracart_rest_api_v2_typescript';
import { channelPartnerApi } from '../api';

/**
 * ChannelPartnerApi.getChannelPartnerOrderByChannelPartnerOrderId() retrieves a single order for a given
 * channel partner order_id.  This might be useful for call centers which only have their order ids and not UltraCart's.
 * It is identical to the OrderApi.getOrder() call in functionality and result,
 * but allows for a restricted permission set.  The channel partner api assumes a tie to a Channel Partner and
 * only allows retrieval of orders created by that Channel Partner.
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
export class GetChannelPartnerOrderByChannelPartnerOrderId {
    /**
     * Execute method to retrieve a channel partner order by its channel partner order ID
     */
    public static async execute(): Promise<void> {
        console.log(`--- ${this.name} ---`);

        try {
            // The expansion variable instructs UltraCart how much information to return.
            // The order object is large and while it's easily manageable for a single order,
            // when querying thousands of orders, is useful to reduce payload size.
            // A channel partner will almost always query an order for the purpose of turning
            // around and submitting it to a refund call.
            const expand: string = "item,summary,shipping";

            // This order MUST be an order associated with this channel partner or you will receive a 400 Bad Request.
            const channelPartnerOrderId: string = "MY-CALL-CENTER-BLAH-BLAH";

            // Retrieve the channel partner order
            const apiResponse: OrderResponse = await channelPartnerApi.getChannelPartnerOrderByChannelPartnerOrderId({orderId: channelPartnerOrderId, expand});

            // Check for any errors in the API response
            if (apiResponse.error) {
                console.error(apiResponse.error.developer_message);
                console.error(apiResponse.error.user_message);
                process.exit(1);
            }

            // Extract and log the order
            const order: Order | undefined = apiResponse.order;
            console.log(order);
        } catch (ex: unknown) {
            // Type the error as unknown and log details
            if (ex instanceof Error) {
                console.error(`Error: ${ex.message}`);
                console.error(ex.stack);
            } else {
                console.error("An unknown error occurred");
            }
        }
    }
}