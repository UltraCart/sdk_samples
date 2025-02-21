"""
Format an order for display with various customization options.

Returns a text or HTML-formatted block similar to a receipt page.
"""

from samples import api_client
from ultracart.apis import OrderApi
from ultracart.models import OrderFormat
from ultracart import ApiException
import logging

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

try:
    # Initialize Order API
    order_api = OrderApi(api_client())

    # Configure format options
    format_options = OrderFormat(
        context='receipt',  # Options: unknown,receipt,shipment,refund,quote-request,quote
        format='table',     # Options: text,div,table,email
        show_contact_info=False,
        show_payment_info=False,
        show_merchant_notes=False,
        email_as_link=True,
        link_file_attachments=True,
        show_internal_information=True,
        show_non_sensitive_payment_info=True,
        show_in_merchant_currency=True,
        hide_bill_to_address=False,
        dont_link_email_to_search=True,
        translate=False
    )

    # Specify order ID
    order_id = 'DEMO-0009104390'

    # Format the order
    api_response = order_api.format(order_id, format_options)

    # Get formatted result
    formatted_result = api_response.formatted_result

    # Print CSS links (if needed)
    for link in api_response.css_links:
        print(f'CSS Link: {link}')

    # Print formatted result
    print(formatted_result)

except ApiException as e:
    logger.error(f"API Exception: {e}")
    print('Order formatting failed.')