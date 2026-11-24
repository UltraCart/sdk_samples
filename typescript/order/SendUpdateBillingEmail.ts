import {orderApi} from '../api';
import {BaseResponse} from 'ultracart_rest_api_v2_typescript';

/*
 * OrderApi.sendUpdateBillingEmail() emails the customer a link to update their billing information on an order
 * that is in Accounts Receivable.  It is the API version of the "Send Billing Update" button on the
 * Accounts Receivable Process Payment screen.  The email goes out within a minute.
 *
 * While the order is less than 7 days old, UltraCart sends a reminder every 2 days after this email.
 *
 * The call is refused (HTTP 400, thrown as a ResponseError) when:
 * - the order is not in Accounts Receivable
 * - the order does not have a valid email address
 * - the update billing email is turned off for the account
 * - a StoreFront communication flow handles unprocessed payments for the order (the flow emails the customer instead)
 * - this method already sent the email for the order in the last 24 hours
 *
 * Requires SDK 4.1.260 or later.
 */
export class SendUpdateBillingEmail {
    public static async execute(): Promise<void> {
        const orderId: string = "DEMO-0009104436";

        try {
            const apiResponse: BaseResponse = await orderApi.sendUpdateBillingEmail({orderId});

            if (apiResponse.error) {
                console.error('Developer Message:', apiResponse.error.developer_message);
                console.error('User Message:', apiResponse.error.user_message);
                return;
            }

            if (apiResponse.success) {
                console.log('Update billing email was queued.');
            }
        } catch (error) {
            // The reason for a refusal is in the response body.
            console.error('Error sending update billing email:', error);
        }
    }
}
