from ultracart.apis import CheckoutApi
from samples import api_client

# Reference Implementation: https://github.com/UltraCart/responsive_checkout
# A simple method for populating the country list boxes with all the countries this merchant has configured to accept.

checkout_api = CheckoutApi(api_client())

api_response = checkout_api.get_allowed_countries()
allowed_countries = api_response.countries

for country in allowed_countries:
    print(country)  # contains both iso2code and name