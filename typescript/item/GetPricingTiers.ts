import { itemApi } from '../api';
import {
    PricingTiersResponse,
    PricingTier
} from 'ultracart_rest_api_v2_typescript';

/**
 * Execute method containing all business logic
 */
export async function execute(): Promise<void> {
    try {
        /*
         * Possible expansion values for PricingTier object:
         * approval_notification
         * signup_notification
         */
        const expand = "approval_notification,signup_notification";
        const apiResponse: PricingTiersResponse = await itemApi.getPricingTiers({expand});

        // Display pricing tiers
        apiResponse.pricingTiers?.forEach((pricingTier: PricingTier) => {
            console.log(pricingTier);
        });
    } catch (error) {
        console.error("Exception occurred.");
        console.error(error);
        process.exit(1);
    }
}