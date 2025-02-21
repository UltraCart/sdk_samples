package webhook;

import com.ultracart.admin.v2.WebhookApi;
import com.ultracart.admin.v2.models.Webhook;
import com.ultracart.admin.v2.models.WebhookEventCategory;
import com.ultracart.admin.v2.models.WebhookEventSubscription;
import com.ultracart.admin.v2.models.WebhookResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.ArrayList;
import java.util.List;

public class InsertWebhook {
    public static void execute() {
        /*
         * Adds a new webhook on the account.  If you add a new webhook with the authentication_type set to basic, but
         * do not specify the basic_username and basic_password, UltraCart will automatically generate random ones and
         * return them.  This allows your application to have simpler logic on the setup of a secure webhook.
         * 
         * Event Category      Event Name                      Description
         * [Full event list from original comment preserved]
         * 
         * Note: Each event uses the same expansions as the event category.  To see a list of possible expansion values,
         * visit www.ultracart.com/api/. Order Expansions (https://www.ultracart.com/api/#resource_order.html) are listed
         * below because most webhooks are for order events.
         * Order Expansion:
         * [Expansion list from original comment preserved]
         * 
         * Note: The WebhookEventSubscription.event_ruler field is processed with the AWS Event Ruler library to filter down
         * events to just what you want.  If you wish to employ a ruler filter, see https://github.com/aws/event-ruler
         * for syntax examples.  You'll need to apply the aws syntax against the UltraCart object models.  Contact UltraCart
         * support if you need assistance creating the proper ruler expression.
         * 
         * Possible Errors:
         */

        WebhookApi webhookApi = new WebhookApi(Constants.API_KEY);

        Webhook webhook = new Webhook();
        webhook.setWebhookUrl("https://www.mywebiste.com/page/to/call/when/this/webhook/fires.php");  // Must be HTTPS if customer related information is being delivered.
        webhook.setAuthenticationType(Webhook.AuthenticationTypeEnum.BASIC);  // "basic","none","api user","aws iam"
        webhook.setBasicUsername("george");
        webhook.setBasicPassword("LlamaLlamaRedPajama");
        webhook.setMaximumEvents(10);
        webhook.setMaximumSize(5242880); // 5 MB is pretty chunky.
        webhook.setApiVersion(Webhook.ApiVersionEnum._2017_03_01); // this is our only API version so far.
        webhook.setCompressEvents(true); // compress events with gzip, then base64 encode them as a string.

        WebhookEventSubscription eventSub1 = new WebhookEventSubscription();
        eventSub1.setEventName("order_create");
        eventSub1.setEventDescription("when an order is placed");
        eventSub1.setExpansion("shipping,billing,item,coupon,summary"); // whatever you need.
        eventSub1.setEventRuler(null); // no filtering.  we want all objects.
        eventSub1.setComments("Merchant specific comment, for example: Bobby needs this webhook for the Accounting department.");

        WebhookEventSubscription eventSub2 = new WebhookEventSubscription();
        eventSub2.setEventName("order_update");
        eventSub2.setEventDescription("when an order is modified");
        eventSub2.setExpansion("shipping,billing,item,coupon,summary"); // whatever you need.
        eventSub2.setEventRuler(null); // no filtering.  we want all objects.
        eventSub2.setComments("Merchant specific comment, for example: Bobby needs this webhook for the Accounting department.");

        WebhookEventSubscription eventSub3 = new WebhookEventSubscription();
        eventSub3.setEventName("order_delete");
        eventSub3.setEventDescription("when an order is modified");
        eventSub3.setExpansion(""); // don't need any expansion on delete.  only need to know the order_id
        eventSub3.setEventRuler(null); // no filtering.  we want all objects.
        eventSub3.setComments("Merchant specific comment, for example: Bobby needs this webhook for the Accounting department.");

        WebhookEventCategory eventCategory1 = new WebhookEventCategory();
        eventCategory1.setEventCategory("order");
        List<WebhookEventSubscription> events = new ArrayList<>();
        events.add(eventSub1);
        events.add(eventSub2);
        events.add(eventSub3);
        eventCategory1.setEvents(events);

        // apiResponse.getWebhook() will return the newly created webhook.
        try {
            WebhookResponse apiResponse = webhookApi.insertWebhook(webhook, false);

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                System.exit(1);
            }

            Webhook createdWebhook = apiResponse.getWebhook();
            // TODO - store the webhook oid in case you ever need to make changes.

            // This should equal what you submitted, plus contain much new information
            System.out.println(createdWebhook.toString());
        } catch (ApiException e) {
            System.err.println("API Exception occurred: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}