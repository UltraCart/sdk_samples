package webhook;

import com.ultracart.admin.v2.WebhookApi;
import com.ultracart.admin.v2.models.Webhook;
import com.ultracart.admin.v2.models.WebhooksResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.ArrayList;
import java.util.List;

public class GetWebhooks {
  /*
   * This example illustrates how to retrieve all webhooks.
   */

  /**
   * Gets a chunk of webhooks
   *
   * @param webhookApi The webhook API instance
   * @param offset     Offset for pagination
   * @param limit      Maximum number of records to return
   * @return List of webhooks
   * @throws ApiException Thrown when API call fails
   */
  private static List<Webhook> getWebhookChunk(WebhookApi webhookApi, int offset, int limit) throws ApiException {
    String sort = null; // default sorting is webhook_url, disabled, and those are also the two choices for sorting.
    Boolean placeholders = null;  // useful for UI displays, but not needed here.
    // Pay attention to whether limit or offset comes first in the method signature. UltraCart is not consistent with their ordering.
    WebhooksResponse apiResponse = webhookApi.getWebhooks(limit, offset, sort, placeholders);

    if (apiResponse.getWebhooks() != null) {
      return apiResponse.getWebhooks();
    }
    return new ArrayList<>();
  }

  public static void execute() {
    WebhookApi webhookApi = new WebhookApi(Constants.API_KEY);

    List<Webhook> webhooks = new ArrayList<>();

    int iteration = 1;
    int offset = 0;
    int limit = 200;
    boolean moreRecordsToFetch = true;

    try {
      while (moreRecordsToFetch) {
        System.out.println("executing iteration " + iteration);

        List<Webhook> chunkOfWebhooks = getWebhookChunk(webhookApi, offset, limit);
        webhooks.addAll(chunkOfWebhooks);
        offset = offset + limit;
        moreRecordsToFetch = chunkOfWebhooks.size() == limit;
        iteration++;
      }
    } catch (ApiException e) {
      System.out.println("ApiException occurred on iteration " + iteration);
      System.out.println(e.toString());
      System.exit(1);
    }

    // this will be verbose...
    for (Webhook webhook : webhooks) {
      System.out.println(webhook.toString());
    }
  }
}