from ultracart.apis import ChannelPartnerApi
from samples import channel_partner_api_client

"""
Retrieves a shipto preference for a channel partner.
These preferences are used by EDI channel partners to automatically
apply return policies and add additional free items to EDI orders based on the EDI code that is present.

Possible Errors:
Attempting to interact with a channel partner other than the one tied to your API Key:
    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."
Supplying a bad channel partner shipto preference oid: "Invalid channel_partner_ship_to_preference_oid specified."
"""

channel_partner_api = ChannelPartnerApi(channel_partner_api_client())
channel_partner_oid = 12345
channel_partner_shipto_preference_oid = 67890
api_response = channel_partner_api.get_channel_partner_ship_to_preference(channel_partner_oid, channel_partner_shipto_preference_oid)

if api_response.error is not None:
    print(api_response.error.developer_message)
    print(api_response.error.user_message)
    exit()

preference = api_response.ship_to_preference

print(preference)