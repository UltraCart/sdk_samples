import { checkoutApi } from '../api';
import {
    CheckoutAllowedCountriesResponse,
    Country
} from 'ultracart_rest_api_v2_typescript';

export class GetAllowedCountries {
    /// <summary>
    /// A simple method for populating the country list boxes with all the countries this merchant has configured to accept.
    /// </summary>
    public static async Execute(): Promise<void> {
        // Reference Implementation: https://github.com/UltraCart/responsive_checkout
        // A simple method for populating the country list boxes with all the countries this merchant has configured to accept.

        try {
            const apiResponse: CheckoutAllowedCountriesResponse = await checkoutApi.getAllowedCountries();
            const allowedCountries: Country[] = apiResponse.countries || [];

            allowedCountries.forEach(country => {
                console.log(JSON.stringify(country, null, 2));
            });
        } catch (error) {
            console.error('Error retrieving allowed countries:', error);
        }
    }
}