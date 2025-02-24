import { fulfillmentApi } from '../api.js';

export class GetDistributionCenters {
    /*
        This method returns back a list of all distribution centers configured for a merchant.

        You will need the distribution center (DC) code for most operations.
        UltraCart allows for multiple DC and the code is a unique short string you assign to a DC as an easy mnemonic.
        This method call is an easy way to determine what a DC code is for a particular distribution center.

        For more information about UltraCart distribution centers, please see:
        https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
    */
    static async Execute() {
        try {
            const result = await new Promise((resolve, reject) => {
                fulfillmentApi.getDistributionCenters({}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            // Safely handle potential undefined distributionCenters
            const distributionCenters = result.distribution_centers || [];

            // Print each distribution center
            distributionCenters.forEach(dc => {
                console.log(JSON.stringify(dc, null, 2));
            });

            console.log("done");
        } catch (e) {
            // update inventory failed. examine the reason.
            console.error(`Exception when calling FulfillmentApi.GetDistributionCenters: ${e instanceof Error ? e.message : e}`);
            process.exit(1);
        }
    }
}