package checkout;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.CheckoutStateProvinceResponse;
import com.ultracart.admin.v2.models.StateProvince;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.List;

public class GetStateProvincesForCountry {
    /**
     * A simple method for populating the state_region list boxes with all the states/regions allowed for a country code.
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     */
    public static void execute() throws ApiException {
        CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);

        String countryCode = "US";

        CheckoutStateProvinceResponse apiResponse = checkoutApi.getStateProvincesForCountry(countryCode);
        List<StateProvince> provinces = apiResponse.getStateProvinces();

        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        for (StateProvince province : provinces) {
            System.out.println(gson.toJson(province));
        }
    }
}