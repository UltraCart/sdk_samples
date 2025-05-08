from ultracart.apis import ChannelPartnerApi
from samples import channel_partner_api_client

channel_partner_api = ChannelPartnerApi(channel_partner_api_client())

api_response = channel_partner_api.get_channel_partner_reason_codes(18413)

print(api_response)