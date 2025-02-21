from ultracart.apis import CheckoutApi
from samples import api_client

# Reference Implementation: https://github.com/UltraCart/responsive_checkout
# A simple method for populating the state_region list boxes with all the states/regions allowed for a country code.

checkout_api = CheckoutApi(api_client())

country_code = 'US'

api_response = checkout_api.get_state_provinces_for_country(country_code)
provinces = api_response.state_provinces

for province in provinces:
    print(province)  # contains both name and abbreviation