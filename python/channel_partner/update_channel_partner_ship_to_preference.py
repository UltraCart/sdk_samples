from ultracart.apis import ChannelPartnerApi
from samples import channel_partner_api_client

# Initialize API
channel_partner_api = ChannelPartnerApi(channel_partner_api_client())
channel_partner_oid = 12345
channel_partner_ship_to_preference_oid = 67890

# Get existing preference
api_response = channel_partner_api.get_channel_partner_ship_to_preference(channel_partner_oid, channel_partner_ship_to_preference_oid)

preference = api_response.ship_to_preference

# Update fields
preference.ship_to_edi_code = 'EDI_CODE_HERE'
preference.return_policy = "This is some return policy text that will be printed on the packing slip."
preference.additional_kit_component_item_ids = ['ITEM_ID1', 'ITEM_ID2', 'ITEM_ID3']
preference.description = "This is a merchant friendly description to help me remember what the above setting are."

# Update the preference
api_response = channel_partner_api.update_channel_partner_ship_to_preference(channel_partner_oid, channel_partner_ship_to_preference_oid, preference)

if api_response.error is not None:
    print(api_response.error.developer_message)
    print(api_response.error.user_message)
    exit()

updated_preference = api_response.ship_to_preference
print(updated_preference)