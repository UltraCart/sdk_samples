import {webhookApi} from '../api.js';

/**
 * This example illustrates how to retrieve all webhooks.
 */
export class GetWebhooks {
    /**
     * Gets a chunk of webhooks
     * @param webhookApi The webhook API instance
     * @param offset Offset for pagination
     * @param limit Maximum number of records to return
     * @returns List of webhooks
     * @throws ApiException Thrown when API call fails
     */
    static async getWebhookChunk(webhookApi, offset, limit) {
        const sort = null; // default sorting is webhook_url, disabled, and those are also the two choices for sorting.
        const placeholders = null;  // useful for UI displays, but not needed here.

        // Pay attention to whether limit or offset comes first in the method signature. UltraCart is not consistent with their ordering.
        const apiResponse = await new Promise((resolve, reject) => {
            webhookApi.getWebhooks({
                _limit: limit,
                _offset: offset,
                _sort: sort,
                _placeholders: placeholders
            }, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        return apiResponse.webhooks || [];
    }

    /**
     * Execute method to fetch and process webhooks
     */
    static async execute() {
        const webhooks = [];

        let iteration = 1;
        let offset = 0;
        const limit = 200;
        let moreRecordsToFetch = true;

        try {
            while (moreRecordsToFetch) {
                console.log(`executing iteration ${iteration}`);

                const chunkOfWebhooks = await GetWebhooks.getWebhookChunk(webhookApi, offset, limit);
                webhooks.push(...chunkOfWebhooks);
                offset = offset + limit;
                moreRecordsToFetch = chunkOfWebhooks.length === limit;
                iteration++;
            }
        } catch (e) {
            console.error(`ApiException occurred on iteration ${iteration}`);
            console.error(e);
            process.exit(1);
        }

        // this will be verbose...
        webhooks.forEach(webhook => {
            console.log(webhook.toString());
        });
    }
}

// Optional: If you want to run this directly
if (require.main === module) {
    GetWebhooks.execute().catch(console.error);
}