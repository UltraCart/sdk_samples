from ultracart.apis import ChannelPartnerApi
from samples import channel_partner_api_client

"""
Retrieves a list of all channel partners configured for this merchant. If the API KEY used is tied to a specific
Channel Partner, then the results will contain only that Channel Partner.
"""

channel_partner_api = ChannelPartnerApi(channel_partner_api_client())
api_response = channel_partner_api.get_channel_partners()

if api_response.error is not None:
    print(api_response.error.developer_message)
    print(api_response.error.user_message)
    exit()

channel_partners = api_response.channel_partners

for channel_partner in channel_partners:
    print(channel_partner)