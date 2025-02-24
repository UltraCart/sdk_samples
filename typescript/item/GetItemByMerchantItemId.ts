import {itemApi} from '../api';
import {
    ItemResponse,
    Item
} from 'ultracart_rest_api_v2_typescript';
import {ItemFunctions} from './ItemFunctions';

export class GetItemByMerchantItemId {
    /**
     * Execute the item retrieval example
     *
     * Of the two getItem methods, you'll probably always use getItemByMerchantItemId instead of this one.
     * Most item work is done with the item id, not the item oid. The latter is only meaningful as a primary
     * key in the UltraCart databases. But here is an example of using getItem(). We take the long route here
     * of retrieving the item using getItemByMerchantItemId to obtain the oid rather than hard-coding it. We do this
     * because these samples are used in our quality control system and run repeatedly.
     */
    public static async execute(): Promise<void> {
        try {
            // Insert a sample item
            const itemId = await ItemFunctions.insertSampleItem();

            // Possible expansion values:
            /*
                accounting
                amember
                auto_order
                auto_order.steps
                ccbill
                channel_partner_mappings
                chargeback
                checkout
                content
                content.assignments
                content.attributes
                content.multimedia
                content.multimedia.thumbnails
                digital_delivery
                ebay
                email_notifications
                enrollment123
                gift_certificate
                google_product_search
                kit_definition
                identifiers
                instant_payment_notifications
                internal
                options
                payment_processing
                physical
                pricing
                pricing.tiers
                realtime_pricing
                related
                reporting
                restriction
                reviews
                salesforce
                shipping
                shipping.cases
                shipping.destination_markups
                shipping.destination_restrictions
                shipping.distribution_centers
                shipping.methods
                shipping.package_requirements
                tax
                third_party_email_marketing
                variations
                wishlist_member
            */
            const expand = "kit_definition,options,shipping,tax,variations"; // just some random ones. contact us if you're unsure

            // Retrieve item by merchant item ID
            const apiResponse: ItemResponse = await itemApi.getItemByMerchantItemId({
                merchantItemId: itemId,
                expand,
                placeholders: false
            });
            const item: Item | undefined = apiResponse.item;

            console.log("The following item was retrieved via getItemByMerchantItemId():");
            console.log(item?.toString());

            // Delete the sample item
            await ItemFunctions.deleteSampleItem(itemId);
        } catch (error) {
            console.error("An ApiException occurred. Please review the following error:");
            console.error(error);
            process.exit(1);
        }
    }
}

// Optional: If you want to execute the method
// GetItemByMerchantItemId.execute().catch(console.error);