import {itemApi} from '../api.js';

/**
 * Execute method containing all business logic
 */
export async function execute() {
    try {
        /*
         * Possible expansion values for PricingTier object:
         * approval_notification
         * signup_notification
         */
        const expand = "approval_notification,signup_notification";
        const apiResponse = await new Promise((resolve, reject) => {
            itemApi.getPricingTiers({_expand: expand}, function (error, data, response) {
                if (error) reject(error);
                else resolve(data, response);
            });
        });

        // Display pricing tiers
        apiResponse.pricingTiers?.forEach((pricingTier) => {
            console.log(pricingTier);
        });
    } catch (error) {
        console.error("Exception occurred.");
        console.error(error);
        process.exit(1);
    }
}