import {
    ChannelPartnerOrder
} from 'ultracart_rest_api_v2_typescript';
import {channelPartnerApi} from '../api';

/**
 * This is a helper function for call centers to calculate the shipping cost on an order.  In a typical flow, the call center
 * will collect all the shipping information and items being purchased into a ChannelPartnerOrder object.
 * They will then call this method, passing in the order object.  The response will contain the shipping estimates
 * that the call center can present to the customer.  Once the customer selects a particulate estimate,
 * they can then plug that cost into their call center application and complete the order.
 *
 * Possible Errors:
 * Using an API key that is not tied to a channel partner: "This API Key does not have permission to interact with channel partner orders.  Please review your Channel Partner configuration."
 * Order has invalid channel partner code: "Invalid channel partner code"
 * Order has no items: "null order.items passed." or "order.items array contains a null entry."
 * Order has no channel partner order id: "order.channelPartnerOrderId must be specified."
 * Order channel partner order id is a duplicate:  "order.channelPartnerOrderId [XYZ] already used."
 * Channel Partner is inactive: "partner is inactive."
 */
export class EstimateShippingForChannelPartnerOrder {
    /**
     * Execute method to estimate shipping for a channel partner order
     */
    public static async execute(): Promise<void> {
        console.log(`--- ${this.name} ---`);

        try {
            // Prepare the channel partner order
            const order: ChannelPartnerOrder = {
                channel_partner_order_id: "widget-1245-abc-1",
                coupons: ["10OFF"],
                // Uncomment and modify as needed
                // deliveryDate: DateTime.now().plus({ days: 14 }).toISO(),
                items: [
                    {
                        // Commented out properties preserved from original code
                        // arbitraryUnitCost: 9.99,
                        // autoOrderLastRebillDts: DateTime.now().minus({ days: 30 }).toISO(),
                        // autoOrderSchedule: "Weekly",
                        merchant_item_id: "shirt",
                        options: [
                            {
                                name: "Size",
                                value: "Small"
                            },
                            {
                                name: "Color",
                                value: "Orange"
                            }
                        ],
                        quantity: 1,
                        upsell: false,
                    }
                ],
                // Uncomment and modify as needed
                // shipOnDate: DateTime.now().plus({ days: 7 }).toISO(),
                ship_to_residential: true,
                shipto_address1: "55 Main Street",
                shipto_address2: "Suite 202",
                shipto_city: "Duluth",
                shipto_company: "Widgets Inc",
                shipto_country_code: "US",
                shipto_day_phone: "6785552323",
                shipto_evening_phone: "7703334444",
                shipto_first_name: "Sally",
                shipto_last_name: "McGonkyDee",
                shipto_postal_code: "30097",
                shipto_state_region: "GA",
                shipto_title: "Director"
            };

            // Estimate shipping for the order
            const apiResponse = await channelPartnerApi.estimateShippingForChannelPartnerOrder({channelPartnerOrder: order});
            const estimates = apiResponse.estimates;

            // TODO: Apply one estimate shipping method (name) and cost to your channel partner order.

            if (estimates !== undefined) {
                // Display shipping estimates
                estimates.forEach(estimate => {
                    console.log(estimate);
                });

                console.log(`Retrieved ${estimates.length} shipping estimates`);
            }
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