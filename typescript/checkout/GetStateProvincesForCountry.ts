import {checkoutApi} from '../api';
import {
    CheckoutStateProvinceResponse,
    StateProvince
} from 'ultracart_rest_api_v2_typescript';

/// <summary>
/// A simple method for populating the state_region list boxes with all the states/regions allowed for a country code.
/// </summary>
export class GetStateProvincesForCountry {
    /// <summary>
    /// A simple method for populating the state_region list boxes with all the states/regions allowed for a country code.
    /// Reference Implementation: https://github.com/UltraCart/responsive_checkout
    /// </summary>
    public static async execute(): Promise<void> {
        // Use the API key from your configuration (replace with actual method of getting API key)
        const countryCode = "US";

        try {
            const apiResponse: CheckoutStateProvinceResponse = await checkoutApi.getStateProvincesForCountry({countryCode});
            const provinces: StateProvince[] = apiResponse.stateProvinces || [];

            provinces.forEach(province => {
                console.log(JSON.stringify(province, null, 2));
            });
        } catch (error) {
            console.error("Error fetching state provinces:", error);
        }
    }
}

// Optional: If you want to call the method
// GetStateProvincesForCountry.execute().catch(console.error);