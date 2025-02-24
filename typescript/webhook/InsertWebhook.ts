import { webhookApi } from '../api';
import {
    Webhook,
    WebhookResponse,
    WebhookEventSubscription,
    WebhookEventCategory
} from 'ultracart_rest_api_v2_typescript';

export class InsertWebhook {
    /**
     * Adds a new webhook on the account.  If you add a new webhook with the authentication_type set to basic, but
     * do not specify the basic_username and basic_password, UltraCart will automatically generate random ones and
     * return them.  This allows your application to have simpler logic on the setup of a secure webhook.
     *
     * Event Categories and Events:
     *
     * auto_order:
     * - auto_order_cancel       Fired when an auto order is canceled
     * - auto_order_create       Fired when an auto order is created
     * - auto_order_decline      Fired when an auto order is declined
     * - auto_order_disable      Fired when an auto order is disabled
     * - auto_order_preshipment  Fired when an auto order generates a new pre-shipment notice
     * - auto_order_rebill       Fired when an auto order is rebilled
     * - auto_order_update       Fired when an auto order is updated
     *
     * chargeback:
     * - chargeback_create       Fired when a chargeback is created
     * - chargeback_delete       Fired when a chargeback is deleted
     * - chargeback_update       Fired when a chargeback is updated
     *
     * checkout:
     * - checkout_cart_abandon           Fired when a cart is abandoned
     * - checkout_cart_send_return_email Fired when a return email should be sent to a customer
     *
     * customer:
     * - customer_create Fired when a customer profile is created
     * - customer_delete Fired when a customer profile is deleted
     * - customer_update Fired when a customer profile is updated
     *
     * fulfillment:
     * - fulfillment_hold      Fired when an order is held for review
     * - fulfillment_transmit  Fired to transmit an order to the fulfillment house
     *
     * item:
     * - item_create Fired when a new item is created
     * - item_delete Fired when an item is deleted
     * - item_update Fired when an item is updated
     *
     * order:
     * - order_abandon_recovery    Fired when a previously abandoned cart turns into an order
     * - order_create              Fired when an order is placed
     * - order_delete              Fired when an order is deleted
     * - order_payment_failed      Fired when a payment fails
     * - order_payment_process     Fired when a payment is processed
     * - order_refund              Fired when an order is refunded
     * - order_reject              Fired when an order is rejected
     * - order_s3_invoice          Fired when an invoice PDF is stored in S3 bucket
     * - order_s3_packing_slip     Fired when a packing slip PDF is stored in an S3 bucket
     * - order_ship                Fired when an order is shipped
     * - order_ship_delivered      Fired when an order has a shipment delivered
     * - order_ship_expected       Fired when an order has an expected delivery date
     * - order_ship_out_for_delivery Fired when an order has a shipment out for delivery
     * - order_stage_change        Fired when an order stage changes
     * - order_update              Fired when an order is edited
     *
     * storefront:
     * - screen_recording Fired when a screen recording is created
     *
     * user:
     * - user_create  Fired when a user is created
     * - user_delete  Fired when a user is deleted
     * - user_login   Fired when a user logs in
     * - user_update  Fired when a user is updated
     *
     * workflow_task:
     * - workflow_task_create Fired when a workflow task is created
     * - workflow_task_delete Fired when a workflow task is deleted
     * - workflow_task_update Fired when a workflow task is updated
     *
     * Note: Each event uses the same expansions as the event category. To see a list of possible expansion values,
     * visit www.ultracart.com/api/. Order Expansions (https://www.ultracart.com/api/#resource_order.html) are listed
     * below because most webhooks are for order events.
     *
     * Order Expansion:
     * - affiliate
     * - auto_order
     * - billing
     * - checkout
     * - affiliate.ledger
     * - channel_partner
     * - coupon
     * - customer_profile
     * - digital_order
     * - edi
     * - fraud_score
     * - gift
     * - gift_certificate
     * - internal
     * - item
     * - linked_shipment
     * - marketing
     * - payment
     * - payment.transaction
     * - point_of_sale
     * - quote
     * - salesforce
     * - shipping
     * - shipping.tracking_number_details
     * - summary
     * - taxes
     * - utms
     *
     * Note: The WebhookEventSubscription.event_ruler field is processed with the AWS Event Ruler library to filter down
     * events to just what you want. If you wish to employ a ruler filter, see https://github.com/aws/event-ruler
     * for syntax examples. You'll need to apply the aws syntax against the UltraCart object models. Contact UltraCart
     * support if you need assistance creating the proper ruler expression.
     *
     * Possible Errors:
     * (Specific error details may vary)
     */
    public static async execute(): Promise<void> {
        const webhook: Webhook = {
            webhook_url: "https://www.mywebiste.com/page/to/call/when/this/webhook/fires.php",  // Must be HTTPS if customer related information is being delivered.
            authentication_type: "basic",  // "basic","none","api user","aws iam"
            basic_username: "george",
            basic_password: "LlamaLlamaRedPajama",
            maximum_events: 10,
            maximum_size: 5242880, // 5 MB is pretty chunky.
            api_version: "2017-03-01", // this is our only API version so far.
            compress_events: true // compress events with gzip, then base64 encode them as a string.
        };

        const eventSub1: WebhookEventSubscription = {
            event_name: "order_create",
            event_description: "when an order is placed",
            expansion: "shipping,billing,item,coupon,summary", // whatever you need.
            event_ruler: undefined, // no filtering.  we want all objects.
            comments: "Merchant specific comment, for example: Bobby needs this webhook for the Accounting department."
        };

        const eventSub2: WebhookEventSubscription = {
            event_name: "order_update",
            event_description: "when an order is modified",
            expansion: "shipping,billing,item,coupon,summary", // whatever you need.
            event_ruler: undefined, // no filtering.  we want all objects.
            comments: "Merchant specific comment, for example: Bobby needs this webhook for the Accounting department."
        };

        const eventSub3: WebhookEventSubscription = {
            event_name: "order_delete",
            event_description: "when an order is modified",
            expansion: "", // don't need any expansion on delete.  only need to know the order_id
            event_ruler: undefined, // no filtering.  we want all objects.
            comments: "Merchant specific comment, for example: Bobby needs this webhook for the Accounting department."
        };

        const eventCategory1: WebhookEventCategory = {
            event_category: "order",
            events: [eventSub1, eventSub2, eventSub3]
        };

        try {
            // apiResponse.webhook will return the newly created webhook.
            const apiResponse: WebhookResponse = await webhookApi.insertWebhook({webhook: webhook, placeholders: false});

            if (apiResponse.error) {
                console.error(apiResponse.error.developer_message);
                console.error(apiResponse.error.user_message);
                process.exit(1);
            }

            const createdWebhook = apiResponse.webhook;
            // TODO - store the webhook oid in case you ever need to make changes.

            // This should equal what you submitted, plus contain much new information
            console.log(createdWebhook?.toString());
        } catch (error) {
            console.error('Error inserting webhook:', error);
            process.exit(1);
        }
    }
}

// Optional: If you want to run this directly
if (require.main === module) {
    InsertWebhook.execute().catch(console.error);
}