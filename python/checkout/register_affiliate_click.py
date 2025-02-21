from flask import request
from ultracart.apis import CheckoutApi
from ultracart.models import RegisterAffiliateClickRequest
from samples import api_client

# Initialize the checkout API
checkout_api = CheckoutApi(api_client())

# Create affiliate click request
click_request = RegisterAffiliateClickRequest(
    ip_address=request.headers.get('X-Forwarded-For', request.remote_addr),
    user_agent=request.headers.get('User-Agent', ''),
    referrer_url=request.referrer or '',
    affid=123456789,  # you should know this from your UltraCart affiliate system
    subid='TODO:SupplyThisValue'
    # landing_page_url=None  # if you have landing page url
)

# Register the affiliate click
api_response = checkout_api.register_affiliate_click(click_request)