import {orderApi} from '../api';
import {Order, OrderValidationRequest, OrderValidationResponse} from 'ultracart_rest_api_v2_typescript';

export class ValidateOrder {
    /*
        validateOrder may be used to check for any and all validation errors that may result from an insertOrder
        or updateOrder call. Because those method are built on our existing infrastructure, some validation
        errors may not bubble up to the rest api call and instead be returned as generic "something went wrong" errors.
        This call will return detail validation issues needing correction.

        Within the ValidationRequest, you may leave the 'checks' array null to check for everything, or pass
        an array of the specific checks you desire. Here is a list of the checks:

        "Billing Address Provided"
        "Billing Destination Restriction"
        "Billing Phone Numbers Provided"
        "Billing State Abbreviation Valid"
        "Billing Validate City State Zip"
        "Email provided if required"
        "Gift Message Length"
        "Item Quantity Valid"
        "Items Present"
        "Merchant Specific Item Relationships"
        "One per customer violations"
        "Referral Code Provided"
        "Shipping Address Provided"
        "Shipping Destination Restriction"
        "Shipping Method Ignore Invalid"
        "Shipping Method Provided"
        "Shipping State Abbreviation Valid"
        "Shipping Validate City State Zip"
        "Special Instructions Length"
     */
    public static async execute(): Promise<void> {
        const expansion: string = "checkout"; // see the getOrder sample for expansion discussion

        const orderId: string = "DEMO-0009104976";
        const orderOrUndefined: Order | undefined = (await orderApi.getOrder({orderId, expand: expansion})).order;

        if (orderOrUndefined !== undefined) {
            const order = orderOrUndefined as Order;

            console.log(JSON.stringify(order, null, 2));

            // TODO: do some updates to the order.
            const validationRequest: OrderValidationRequest = {
                order: order,
                checks: undefined // leaving this undefined to perform all validations.
            };

            const apiResponse: OrderValidationResponse = await orderApi.validateOrder({validationRequest});

            console.log("Validation errors:");
            if (apiResponse.errors !== undefined) {
                for (const error of apiResponse.errors) {
                    console.log(`- ${error}`);
                }
            } else {
                console.log("No validation errors found.");
            }

            console.log("\nValidation messages:");
            if (apiResponse.messages !== undefined) {
                for (const message of apiResponse.messages) {
                    console.log(`- ${message}`);
                }
            } else {
                console.log("No validation messages found.");
            }
        }
    }
}