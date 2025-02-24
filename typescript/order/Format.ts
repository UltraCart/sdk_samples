import { orderApi } from '../api';
import { OrderFormat, OrderFormatResponse } from 'ultracart_rest_api_v2_typescript';

export class Format {
    /**
     * format() returns back a text-formatted or html block for displaying an order. It is similar to what you would
     * see on a receipt page.
     */
    public static async execute(): Promise<void> {
        // Create format options
        const formatOptions: OrderFormat = {
            context: 'receipt', // unknown,receipt,shipment,refund,quote-request,quote
            format: 'table', // text,div,table,email
            show_contact_info: false,
            show_payment_info: false, // might not want to show this to just anyone.
            show_merchant_notes: false, // be careful showing these
            email_as_link: true, // makes the email addresses web links

            // if you only wish to show the items for a particular distribution center,
            // this might be useful if you have Context='shipment' and you're displaying this order to a fulfillment center, etc
            // filterDistributionCenterOid: 1234321,

            link_file_attachments: true,
            show_internal_information: true, // consider this carefully.
            show_non_sensitive_payment_info: true, // what the customer usually sees
            show_in_merchant_currency: true,
            hide_bill_to_address: false,

            // filterToItemsInContainerOid: 123454321, // you probably won't need this.

            // when an order displays on the secure.ultracart.com site, we link the email to our order search so you can quickly
            // search for all orders for that email. I doubt you would have use for that. But maybe.
            dont_link_email_to_search: true,
            translate: false // if true, shows in customer's native language
        };

        const orderId = 'DEMO-0009104390';

        try {
            // Await the API call
            const apiResponse: OrderFormatResponse = await orderApi.format({orderId, formatOptions});

            const formattedResult = apiResponse.formatted_result;

            // Construct HTML output
            console.log('<html lang="en">');
            console.log('<head>');

            // you won't have css links for format=table
            if (apiResponse.css_links) {
                apiResponse.css_links.forEach(link => {
                    console.log(`<style type="text/css">${link}</style>`);
                });
            }

            console.log('</head><body>');
            console.log(formattedResult);
            console.log('</body></html>');
        } catch (error) {
            console.error('Error formatting order:', error);
        }
    }
}

// Optional: If you want to call the method
// Format.execute();