import { DateTime } from 'luxon';
import { channelPartnerApi } from '../api.js';

/**
 * Imports channel partner orders into UltraCart
 *
 * To run channel partner examples, you will need:
 * 1) An API Key: https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
 * 2) That API Key must be assigned to a channel partner: https://secure.ultracart.com/merchant/configuration/customChannelPartnerListLoad.do
 *
 * The spreadsheet import docs will serve you well here. They describe many fields
 * https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377246/Channel+Partner+API+-+Spreadsheet+Import
 */
export async function execute() {
    console.log(`--- ${execute.name} ---`);

    try {
        // ---------------------------------------------
        // Example 1 - Order needs payment processing
        // ---------------------------------------------
        const order = {
            associate_with_customer_profile_if_present: true,
            auto_approve_purchase_order: true,
            billto_address1: "11460 Johns Creek Parkway",
            billto_address2: "Suite 101",
            billto_city: "Duluth",
            billto_company: "Widgets Inc",
            billto_country_code: "US",
            billto_day_phone: "6784153823",
            billto_evening_phone: "6784154019",
            billto_first_name: "John",
            billto_last_name: "Smith",
            billto_postal_code: "30097",
            billto_state_region: "GA",
            billto_title: "Sir",
            cc_email: "orders@widgets.com",
            channel_partner_order_id: "widget-1245-abc",
            consider_recurring: false,
            coupons: ["10OFF", "BUY1GET1"],
            credit_card_expiration_month: 5,
            credit_card_expiration_year: 2032,
            credit_card_type: "VISA",
            custom_field1: "Whatever",
            custom_field2: "You",
            custom_field3: "Want",
            custom_field4: "Can",
            custom_field5: "Go",
            custom_field6: "In",
            custom_field7: "CustomFields",
            delivery_date: DateTime.now().toISO(),
            email: "ceo@widgets.com",
            gift: false,
            gift_email: "sally@aol.com",
            gift_message: "Congratulations on your promotion!",
            hosted_fields_card_token: "7C97B0AAA26AB10180B4B29F00380101",
            hosted_fields_cvv_token: "C684AB4336787F0180B4B51971380101",
            ip_address: "34.125.95.217",
            least_cost_route: true,
            least_cost_route_shipping_methods: ["FedEx: Ground", "UPS: Ground", "USPS: Priority"],
            mailing_list_opt_in: true,
            no_realtime_payment_processing: false,
            payment_method: "CreditCard",
            rotating_transaction_gateway_code: "MyStripe",
            screen_branding_theme_code: "SF1986",
            ship_on_date: DateTime.now().toISO(),
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
            shipto_title: "Director",
            skip_payment_processing: false,
            special_instructions: "Please wrap this in bubble wrap because my FedEx delivery guy is abusive to packages",
            store_completed: false,
            storefront_host_name: "store.mysite.com",
            store_if_payment_declines: false,
            tax_county: "Gwinnett",
            tax_exempt: false,
            treat_warnings_as_errors: true,

            // Items
            items: [{
                merchant_item_id: "shirt",
                quantity: 1,
                upsell: false,
                options: [
                    { name: "Size", value: "Small" },
                    { name: "Color", value: "Orange" }
                ]
            }],

            // Transaction
            transaction: {
                successful: false,
                details: []
            }
        };

        // Import the first order
        const apiResponse = await new Promise((resolve, reject) => {
            channelPartnerApi.importChannelPartnerOrder(order, (error, data, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        // ---------------------------------------------
        // Example 2 - Order already processed
        // ---------------------------------------------
        const processedOrder = {
            ...order,
            no_realtime_payment_processing: true,
            skip_payment_processing: true,
            store_completed: true,
            shipping_method: "FedEx: Ground",
            transaction: {
                successful: true,
                details: [
                    { name: "AVS Code", value: "X" },
                    { name: "Authorization Code", value: "123456" },
                    { name: "CVV Code", value: "M" },
                    { name: "Response Code", value: "Authorized" },
                    { name: "Reason Code", value: "1" },
                    { name: "Response Subcode", value: "1" },
                    { name: "Transaction ID", value: "1234567890" }
                ]
            }
        };

        // Import the processed order
        const processedApiResponse = await new Promise((resolve, reject) => {
            channelPartnerApi.importChannelPartnerOrder(processedOrder, (error, data, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        console.log("Orders imported successfully");
    } catch (ex) {
        console.error(`Error: ${ex instanceof Error ? ex.message : 'Unknown error'}`);
        console.error(ex instanceof Error ? ex.stack : ex);
    }
}

// Optional: If you want to run this directly
if (require.main === module) {
    execute().catch(console.error);
}
