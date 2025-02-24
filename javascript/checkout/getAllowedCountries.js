import { checkoutApi } from '../api.js';

export class GetAllowedCountries {
    /// <summary>
    /// A simple method for populating the country list boxes with all the countries this merchant has configured to accept.
    /// </summary>
    static async Execute() {
        // Reference Implementation: https://github.com/UltraCart/responsive_checkout
        // A simple method for populating the country list boxes with all the countries this merchant has configured to accept.

        try {
            const apiResponse = await new Promise((resolve, reject) => {
                checkoutApi.getAllowedCountries(function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const allowedCountries = apiResponse.countries || [];

            allowedCountries.forEach(country => {
                console.log(JSON.stringify(country, null, 2));
            });
        } catch (error) {
            console.error('Error retrieving allowed countries:', error);
        }
    }
}