from ultracart.apis import FulfillmentApi
from samples import api_client
from ultracart.rest import ApiException

"""
This method returns back a list of all distribution centers configured for a merchant.

You will need the distribution center (DC) code for most operations.
UltraCart allows for multiple DC and the code is a unique short string you assign to a DC as an easy mnemonic.
This method call is an easy way to determine what a DC code is for a particular distribution center.

For more information about UltraCart distribution centers, please see:
https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
"""

fulfillment_api = FulfillmentApi(api_client())

try:
    result = fulfillment_api.get_distribution_centers()
    print(result)

    print("done")
except ApiException as e:
    # update inventory failed. examine the reason.
    print(f'Exception when calling FulfillmentApi->get_distribution_centers: {e}')
    exit(1)