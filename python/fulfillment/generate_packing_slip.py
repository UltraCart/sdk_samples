from ultracart.apis import FulfillmentApi
from samples import api_client
from ultracart.rest import ApiException
import base64

"""
generatePackingSlip accepts a distribution center code and order_id and returns back a base64 encoded byte array pdf.
Both the dc code and order_id are needed because an order may have multiple items shipping via different DCs.

You will need the distribution center (DC) code. UltraCart allows for multiple DC and the code is a
unique short string you assign to a DC as an easy mnemonic.

For more information about UltraCart distribution centers, please see:
https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

If you do not know your DC code, query a list of all DC and print them out:
result = fulfillment_api.get_distribution_centers()
print(result)
"""

fulfillment_api = FulfillmentApi(api_client())

distribution_center_code = 'RAMI'
orders_id = 'DEMO-12345'

try:
    # limit is 500 inventory updates at a time. batch them if you're going large.
    api_response = fulfillment_api.generate_packing_slip(distribution_center_code, orders_id)
    base64_pdf = api_response.get_pdf_base64()
    decoded_pdf = base64.b64decode(base64_pdf)

    with open('packing_slip.pdf', 'wb') as f:
        f.write(decoded_pdf)

    print("done")
except ApiException as e:
    # update inventory failed. examine the reason.
    print(f'Exception when calling FulfillmentApi->generate_packing_slip: {e}')
    exit(1)