import {orderApi} from '../api.js';

/**
 * OrderApi.getOrderByToken() was created for use within a custom thank-you page.  The built-in StoreFront
 * thank you page displays the customer receipt and allows for unlimited customization.  However, many
 * merchants wish to process the receipt page on their own servers to do custom processing.
 *
 * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377199/Custom+Thank+You+Page+URL
 *
 * When setting up a custom thank-you url in the StoreFronts, you will provide a query parameter that will hold
 * this order token.  You many extract that from the Request.QueryString object, then turn around and call getOrderByToken
 * to get the order object.
 */
export async function execute() {
    // The expansion variable instructs UltraCart how much information to return.  The order object is large and
    // while it's easily manageable for a single order, when querying thousands of orders, is useful to reduce
    // payload size.
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
    const expansion = "billing,checkout,coupon,customer_profile,item,payment,shipping,summary,taxes";

    // the token will be in a Request.QueryString parameter defined by you within your storefront.
    // StoreFront -> Privacy and Tracking -> Advanced -> CustomThankYouUrl
    // Example would be: www.mysite.com/receipt.aspx?OrderToken=[OrderToken]

    // Assuming this is collected from query parameters
    // TODO: Replace with actual method of obtaining order token
    const orderToken = "DEMO:UZBOGywSKKwD2a5wx5JwmkwyIPNsGrDHNPiHfxsi0iAEcxgo9H74J/l6SR3X8g=="; // this won't work for you...
    // to generate an order token manually for testing, set generateOrderToken.ts
    // TODO (for you, the merchant): handle missing order token (perhaps this page somehow called by a search engine, etc).

    const orderTokenQuery = {
        order_token: orderToken
    };

    try {
        const apiResponse = await new Promise((resolve, reject) => {
            orderApi.getOrderByToken(
                orderTokenQuery,
                {_expand: expansion}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        const order = apiResponse.order;

        if (order) {
            console.log(JSON.stringify(order, null, 2));
        } else {
            console.log('No order found');
        }
    } catch (error) {
        console.error('Error fetching order:', error);
    }
}