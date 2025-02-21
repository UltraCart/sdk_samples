from ultracart.apis import CheckoutApi
from ultracart.models import CheckoutSetupBrowserKeyRequest
from samples import api_client

# Initialize the checkout API
checkout_api = CheckoutApi(api_client())

# Create browser key request
key_request = CheckoutSetupBrowserKeyRequest(allowed_referrers=["https://www.mywebsite.com"])

# Get browser key
browser_key = checkout_api.setup_browser_key(key_request).browser_key