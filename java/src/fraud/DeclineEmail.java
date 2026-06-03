package fraud;

import com.ultracart.admin.v2.FraudApi;
import com.ultracart.admin.v2.models.FraudDeclineEmailRequest;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

/**
 * declineEmail is a shortcut for telling UltraCart to decline orders from a specific email
 * address. It is the quick alternative to building a full "address email" fraud rule by hand.
 */
public class DeclineEmail {
    public static void execute() {
        System.out.println("--- DeclineEmail ---");
        try {
            FraudApi fraudApi = new FraudApi(Constants.API_KEY);

            FraudDeclineEmailRequest declineRequest = new FraudDeclineEmailRequest();
            declineRequest.setEmail("chargeback-charlie@example.com");

            fraudApi.declineEmail(declineRequest);

            System.out.println("Declined email: " + declineRequest.getEmail());
        } catch (ApiException e) {
            System.out.println("Exception: " + e.getMessage());
        }
    }
}
