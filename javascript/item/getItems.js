import {itemApi} from '../api.js';

export class GetItems {
    /// <summary>
    /// Execute the item retrieval example
    /// </summary>
    static async execute() {
        /*
         * This example illustrates how to retrieve items. When dealing with items, please note that categories are
         * essentially folders to organize and store items. They are only used for that purpose and play no role in
         * the checkout process or in the storefront display of items. So you may organize your items as best serves
         * you. We're often asked why was use the word 'category' instead of 'folder'. We started down the road of
         * item management 27 years ago with the word 'category', and it's too much trouble to change. So items are
         * managed by categories, not folders. But they are folders. :)
         * The call takes two possible parameters:
         * 1) parentCategoryId: This is a number which uniquely identifies a category in our system. Not easy to determine.
         * 2) parentCategoryPath: This is the folder path you wish to retrieve, starting with a forward slash "/"
         * If you provide neither of these values, all items are returned.
         */

        const items = [];

        let iteration = 1;
        let offset = 0;
        const limit = 200;
        let moreRecordsToFetch = true;

        try {
            while (moreRecordsToFetch) {
                console.log(`executing iteration ${iteration}`);

                const chunkOfItems = await this.getItemChunk(offset, limit);
                items.push(...chunkOfItems);
                offset += limit;
                moreRecordsToFetch = chunkOfItems.length === limit;
                iteration++;
            }
        } catch (e) {
            console.log(`ApiException occurred on iteration ${iteration}`);
            console.log(e);
            throw e; // Equivalent to Environment.Exit(1), but better for async context
        }

        // this will be verbose...
        for (const item of items) {
            console.log(item);
        }
    }

    /// <summary>
    /// Get a chunk of items from the API
    /// </summary>
    /// <param name="offset">Starting offset for retrieval</param>
    /// <param name="limit">Maximum number of records to retrieve</param>
    /// <returns>List of retrieved items</returns>
    static async getItemChunk(offset, limit) {
        // The real devil in the getItem calls is the expansion, making sure you return everything you need without
        // returning everything since these objects are extremely large.
        // These are the possible expansion values.
        /*
        accounting                      amember                     auto_order                      auto_order.steps
        ccbill                          channel_partner_mappings    chargeback                      checkout
        content                         content.assignments         content.attributes              content.multimedia
        content.multimedia.thumbnails   digital_delivery            ebay                            email_notifications
        enrollment123                   gift_certificate            google_product_search           kit_definition
        identifiers                     instant_payment_notifications   internal                    options
        payment_processing              physical                    pricing                         pricing.tiers
        realtime_pricing                related                     reporting                       restriction
        reviews                         salesforce                  shipping                        shipping.cases
        tax                             third_party_email_marketing variations                      wishlist_member
        shipping.destination_markups
        shipping.destination_restrictions
        shipping.distribution_centers
        shipping.methods
        shipping.package_requirements
        */
        const expand = "kit_definition,options,shipping,tax,variations"; // just some random ones. contact us if you're unsure

        const parentCategoryId = undefined;
        const parentCategoryPath = undefined;
        const since = undefined;
        const sort = undefined;

        const request = {
            parentCategoryId: parentCategoryId,
            parentCategoryPath: parentCategoryPath,
            _limit: limit,
            _offset: offset,
            _since: since,
            _sort: sort,
            _expand: expand,
            _placeholders: false
        };
        const apiResponse = await new Promise((resolve, reject) => {
            itemApi.getItems(request, function (error, data, response) {
                if (error) reject(error);
                else resolve(data, response);
            });
        });

        return apiResponse.items || [];
    }
}