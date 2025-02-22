require 'ultracart_api'
require_relative '../constants'

# Adds a new webhook on the account.  If you add a new webhook with the authentication_type set to basic, but
# do not specify the basic_username and basic_password, UltraCart will automatically generate random ones and
# return them.  This allows your application to have simpler logic on the setup of a secure webhook.
#
# Event Category      Event Name                      Description
# auto_order         auto_order_cancel               Fired when an auto order is canceled
# auto_order         auto_order_create               Fired when an auto order is created
# auto_order         auto_order_decline              Fired when an auto order is declined
# auto_order         auto_order_disable              Fired when an auto order is disabled
# auto_order         auto_order_preshipment          Fired when an auto order generates a new pre-shipment notice
# auto_order         auto_order_rebill               Fired when an auto order is rebilled
# auto_order         auto_order_update               Fired when an auto order is updated
# chargeback         chargeback_create               Fired when a chargeback is created
# chargeback         chargeback_delete               Fired when a chargeback is deleted
# chargeback         chargeback_update               Fired when a chargeback is updated
# checkout           checkout_cart_abandon           Fired when a cart is abandoned
# checkout           checkout_cart_send_return_email Fired when a return email should be sent to a customer
# customer           customer_create                 Fired when a customer profile is created.
# customer           customer_delete                 Fired when a customer profile is deleted.
# customer           customer_update                 Fired when a customer profile is updated.
# fulfillment        fulfillment_hold                Fired when an order is held for review
# fulfillment        fulfillment_transmit            Fired to transmit an order to the fulfillment house
# item               item_create                     Fired when a new item is created.
# item               item_delete                     Fired when an item is deleted.
# item               item_update                     Fired when an item is updated.
# order              order_abandon_recovery          Fired when a previously abandoned cart turns into an order
# order              order_create                    Fired when an order is placed
# order              order_delete                    Fired when an order is deleted
# order              order_payment_failed            Fired when a payment fails
# order              order_payment_process           Fired when a payment is processed
# order              order_refund                    Fired when an order is refunded
# order              order_reject                    Fired when an order is rejected
# order              order_s3_invoice                Fired when an invoice PDF is stored in S3 bucket
# order              order_s3_packing_slip           Fired when a packing slip PDF is stored in an S3 bucket
# order              order_ship                      Fired when an order is shipped
# order              order_ship_delivered            Fired when an order has a shipment delivered
# order              order_ship_expected             Fired when an order has an expected delivery date
# order              order_ship_out_for_delivery     Fired when an order has a shipment out for delivery
# order              order_stage_change              Fired when an order stage changes
# order              order_update                    Fired when an order is edited
# storefront         screen_recording                Fired when a screen recording is created
# user               user_create                     Fired when a user is created
# user               user_delete                     Fired when a user is deleted
# user               user_login                      Fired when a user logs in
# user               user_update                     Fired when a user is updated
# workflow_task      workflow_task_create            Fired when a workflow task is created
# workflow_task      workflow_task_delete            Fired when a workflow task is deleted
# workflow_task      workflow_task_update            Fired when a workflow task is updated
#
# Note: Each event uses the same expansions as the event category.  To see a list of possible expansion values,
# visit www.ultracart.com/api/. Order Expansions (https://www.ultracart.com/api/#resource_order.html) are listed
# below because most webhooks are for order events.
# Order Expansion:
# affiliate          auto_order          billing             checkout
# affiliate.ledger   channel_partner     coupon             customer_profile
# digital_order      edi                 fraud_score        gift
# gift_certificate   internal            item               linked_shipment
# marketing          payment             payment.transaction point_of_sale
# quote              salesforce          shipping           shipping.tracking_number_details
# summary            taxes               utms
#
# Note: The WebhookEventSubscription.event_ruler field is processed with the AWS Event Ruler library to filter down
# events to just what you want.  If you wish to employ a ruler filter, see https://github.com/aws/event-ruler
# for syntax examples.  You'll need to apply the aws syntax against the UltraCart object models.  Contact UltraCart
# support if you need assistance creating the proper ruler expression.

webhook_api = UltracartClient::WebhookApi.new_using_api_key(Constants::API_KEY)

webhook = UltracartClient::Webhook.new
webhook.webhook_url = "https://www.mywebiste.com/page/to/call/when/this/webhook/fires.php"  # Must be HTTPS if customer related information is being delivered.
webhook.authentication_type = "basic"  # "basic","none","api user","aws iam"
webhook.basic_username = "george"
webhook.basic_password = "LlamaLlamaRedPajama"
webhook.maximum_events = 10
webhook.maximum_size = 5242880 # 5 MB is pretty chunky.
webhook.api_version = "2017-03-01" # this is our only API version so far.
webhook.compress_events = true # compress events with gzip, then base64 encode them as a string.

event_sub1 = UltracartClient::WebhookEventSubscription.new
event_sub1.event_name = "order_create"
event_sub1.event_description = "when an order is placed"
event_sub1.expansion = "shipping,billing,item,coupon,summary" # whatever you need.
event_sub1.event_ruler = nil # no filtering.  we want all objects.
event_sub1.comments = "Merchant specific comment, for example: Bobby needs this webhook for the Accounting department."

event_sub2 = UltracartClient::WebhookEventSubscription.new
event_sub2.event_name = "order_update"
event_sub2.event_description = "when an order is modified"
event_sub2.expansion = "shipping,billing,item,coupon,summary" # whatever you need.
event_sub2.event_ruler = nil # no filtering.  we want all objects.
event_sub2.comments = "Merchant specific comment, for example: Bobby needs this webhook for the Accounting department."

event_sub3 = UltracartClient::WebhookEventSubscription.new
event_sub3.event_name = "order_delete"
event_sub3.event_description = "when an order is modified"
event_sub3.expansion = "" # don't need any expansion on delete.  only need to know the order_id
event_sub3.event_ruler = nil # no filtering.  we want all objects.
event_sub3.comments = "Merchant specific comment, for example: Bobby needs this webhook for the Accounting department."

event_category1 = UltracartClient::WebhookEventCategory.new
event_category1.event_category = "order"
event_category1.events = [event_sub1, event_sub2, event_sub3]

# api_response.webhook will return the newly created webhook.
api_response = webhook_api.insert_webhook(webhook, false)

if api_response.error
  puts api_response.error.developer_message
  puts api_response.error.user_message
  exit
end

created_webhook = api_response.webhook
# TODO - store the webhook oid in case you ever need to make changes.

# This should equal what you submitted, plus contain much new information
puts created_webhook.inspect