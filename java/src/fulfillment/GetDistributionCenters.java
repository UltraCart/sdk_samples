package fulfillment;

import com.ultracart.admin.v2.FulfillmentApi;
import com.ultracart.admin.v2.models.DistributionCenter;
import com.ultracart.admin.v2.models.DistributionCentersResponse;
import common.Constants;

public class GetDistributionCenters {
    /*
        This method returns back a list of all distribution centers configured for a merchant.

        You will need the distribution center (DC) code for most operations.
        UltraCart allows for multiple DC and the code is a unique short string you assign to a DC as an easy mnemonic.
        This method call is an easy way to determine what a DC code is for a particular distribution center.

        For more information about UltraCart distribution centers, please see:
        https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
    */

  public static void execute() {
    FulfillmentApi fulfillmentApi = new FulfillmentApi(Constants.API_KEY);

    try {
      DistributionCentersResponse result = fulfillmentApi.getDistributionCenters();
      for (DistributionCenter dc : result.getDistributionCenters()) {
        System.out.println(dc.toString());
      }

      System.out.println("done");
    } catch (Exception e) {
      // update inventory failed. examine the reason.
      System.out.println("Exception when calling FulfillmentApi.getDistributionCenters: " + e.getMessage());
      System.exit(1);
    }
  }
}