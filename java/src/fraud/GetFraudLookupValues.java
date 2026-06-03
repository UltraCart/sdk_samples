package fraud;

import com.ultracart.admin.v2.FraudApi;
import com.ultracart.admin.v2.models.FraudLookupValues;
import com.ultracart.admin.v2.models.FraudLookupValuesResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

/**
 * getFraudLookupValues returns the lookup values used when building fraud rules:
 * the allowed countries, affiliates, ip range types, rule groups, and rule types.
 * Call this first when constructing a rule so you supply valid values.
 */
public class GetFraudLookupValues {
    public static void execute() {
        System.out.println("--- GetFraudLookupValues ---");
        try {
            FraudApi fraudApi = new FraudApi(Constants.API_KEY);

            FraudLookupValuesResponse apiResponse = fraudApi.getFraudLookupValues();
            FraudLookupValues lookupValues = apiResponse.getFraudLookupValues();

            System.out.println("Rule types: " + lookupValues.getRuleTypes());
            System.out.println("Rule groups: " + lookupValues.getRuleGroups());
            System.out.println("IP range types: " + lookupValues.getIpRangeTypes());
            System.out.println("Countries: " + lookupValues.getCountries());
        } catch (ApiException e) {
            System.out.println("Exception: " + e.getMessage());
        }
    }
}
