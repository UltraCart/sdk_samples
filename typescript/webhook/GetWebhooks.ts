import { webhookApi } from '../api';
import { Webhook, WebhooksResponse } from 'ultracart_rest_api_v2_typescript';

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
    private static async getWebhookChunk(webhookApi: any, offset: number, limit: number): Promise<Webhook[]> {
        const sort: string | null = null; // default sorting is webhook_url, disabled, and those are also the two choices for sorting.
        const placeholders: boolean | null = null;  // useful for UI displays, but not needed here.

        // Pay attention to whether limit or offset comes first in the method signature. UltraCart is not consistent with their ordering.
        const apiResponse: WebhooksResponse = await webhookApi.getWebhooks(limit, offset, sort, placeholders);

        return apiResponse.webhooks || [];
    }

    /**
     * Execute method to fetch and process webhooks
     */
    public static async execute(): Promise<void> {
        const webhooks: Webhook[] = [];

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