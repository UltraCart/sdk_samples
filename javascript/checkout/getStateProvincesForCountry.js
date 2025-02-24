import {checkoutApi} from '../api.js';

/// <summary>
/// A simple method for populating the state_region list boxes with all the states/regions allowed for a country code.
/// </summary>
export class GetStateProvincesForCountry {
    /// <summary>
    /// A simple method for populating the state_region list boxes with all the states/regions allowed for a country code.
    /// Reference Implementation: https://github.com/UltraCart/responsive_checkout
    /// </summary>
    static async execute() {
        // Use the API key from your configuration (replace with actual method of getting API key)
        const countryCode = "US";

        try {
            const apiResponse = await new Promise((resolve, reject) => {
                checkoutApi.getStateProvincesForCountry(countryCode, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const provinces = apiResponse.stateProvinces || [];

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