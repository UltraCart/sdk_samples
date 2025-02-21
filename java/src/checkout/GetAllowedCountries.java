package checkout;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.CheckoutAllowedCountriesResponse;
import com.ultracart.admin.v2.models.Country;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.List;

public class GetAllowedCountries {
    /**
     * Populates the country list with all countries the merchant has configured to accept
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     */
    public static void execute() {
        CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);

        try {
            CheckoutAllowedCountriesResponse apiResponse = checkoutApi.getAllowedCountries();
            List<Country> allowedCountries = apiResponse.getCountries();

            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            for (Country country : allowedCountries) {
                System.out.println(gson.toJson(country));
            }
        } catch (ApiException e) {
            e.printStackTrace();
        }
    }
}