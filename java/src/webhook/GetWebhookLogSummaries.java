package webhook;

import com.ultracart.admin.v2.WebhookApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class GetWebhookLogSummaries {
   /*
    * This example illustrates how to retrieve webhook log summaries.
    */

   /**
    * Gets a chunk of webhook log summaries
    * @param webhookApi The webhook API instance
    * @param offset Offset for pagination
    * @param limit Maximum number of records to return
    * @return Array of webhook log summaries
    * @throws ApiException Thrown when API call fails
    */
   private static List<WebhookLogSummary> getSummaryChunk(WebhookApi webhookApi, int offset, int limit) throws ApiException {
       int webhookOid = 123456789; // if you don't know this, use getWebhooks to find your webhook, then get its oid.
       String since = Instant.now().minus(10, ChronoUnit.DAYS).toString(); // get the last 10 days
       // Pay attention to whether limit or offset comes first in the method signature. UltraCart is not consistent with their ordering.
       WebhookLogSummariesResponse apiResponse = webhookApi.getWebhookLogSummaries(webhookOid, limit, offset, since);

       if (apiResponse.getWebhookLogSummaries() != null) {
           return apiResponse.getWebhookLogSummaries();
       }
       return new ArrayList<WebhookLogSummary>();
   }

   public static void execute() {
       WebhookApi webhookApi = new WebhookApi(Constants.API_KEY);
       
       List<WebhookLogSummary> summaries = new ArrayList<WebhookLogSummary>();

       int iteration = 1;
       int offset = 0;
       int limit = 200;
       boolean moreRecordsToFetch = true;

       try {
           while (moreRecordsToFetch) {
               System.out.println("executing iteration " + iteration);

               List<WebhookLogSummary> chunkOfSummaries = getSummaryChunk(webhookApi, offset, limit);
               summaries.addAll(chunkOfSummaries);
               offset = offset + limit;
               moreRecordsToFetch = chunkOfSummaries.size() == limit;
               iteration++;
           }
       } catch (ApiException e) {
           System.out.println("ApiException occurred on iteration " + iteration);
           System.out.println(e.toString());
           System.exit(1);
       }

       // this will be verbose...
       for (WebhookLogSummary summary : summaries) {
           System.out.println(summary.toString());
       }
   }
}