// Import API and UltraCart types
import { webhookApi } from '../api';
import { WebhookLogSummary } from 'ultracart_rest_api_v2_typescript';
import { DateTime } from 'luxon';

// Namespace-like structure using a class
export class GetWebhookLogSummaries {
  /*
   * This example illustrates how to retrieve webhook log summaries.
   */

  /**
   * Gets a chunk of webhook log summaries
   * @param offset Offset for pagination
   * @param limit Maximum number of records to return
   * @returns Array of webhook log summaries
   * @throws Error when API call fails
   */
  private static async getSummaryChunk(offset: number, limit: number): Promise<WebhookLogSummary[]> {
    const webhookOid = 123456789; // if you don't know this, use getWebhooks to find your webhook, then get its oid
    const since = DateTime.now()
      .setZone('America/New_York')
      .minus({ days: 10 })
      .startOf('day')
      .toISO(); // get the last 10 days in ISO8601 format

    // UltraCart API call with parameters as an anonymous interface
    // Note: Order of limit/offset may vary; adjust based on SDK signature
    const apiResponse = await webhookApi.getWebhookLogSummaries({
      webhookOid: webhookOid,
      limit: limit,
      offset: offset,
      since: since,
    });

    if (apiResponse.webhook_log_summaries) {
      return apiResponse.webhook_log_summaries;
    }
    return [];
  }

  public static async execute(): Promise<void> {
    const summaries: WebhookLogSummary[] = [];

    let iteration = 1;
    let offset = 0;
    const limit = 200;
    let moreRecordsToFetch = true;

    try {
      while (moreRecordsToFetch) {
        console.log(`executing iteration ${iteration}`);

        const chunkOfSummaries = await this.getSummaryChunk(offset, limit);
        summaries.push(...chunkOfSummaries);
        offset += limit;
        moreRecordsToFetch = chunkOfSummaries.length === limit;
        iteration++;
      }

      // this will be verbose...
      for (const summary of summaries) {
        console.log(summary); // No ToString() in TS; outputs JSON-like object
      }
    } catch (ex) {
      console.log(`Error occurred on iteration ${iteration}`);
      console.log((ex as Error).toString());
      process.exit(1); // Equivalent to Environment.Exit(1) in Node.js
    }
  }
}
