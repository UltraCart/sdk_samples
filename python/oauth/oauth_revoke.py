"""
This is a last feature of the UltraCart OAuth Security Implementation.
oauthRevoke is used to kill an access token.
Call this method when a customer desires to terminate using your Developer Application.

The first step in implementing an OAuth authorization to your UltraCart Developer Application is
creating a Client ID and Secret.  See the following doc for instructions on doing so:
https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/3488907265/Developer+Applications+-+Creating+a+Client+ID+and+Secret+for+an+OAuth+Application
"""

from ultracart.apis import OauthApi
from samples import api_client

# this is given to you when you create your application (see the doc link above)
client_id = "5e31ce86e17f02015a35257c47151544"
# this is stored by your application somewhere somehow.
access_token = "123456789012345678901234567890"

# Create OAuth API instance
oauth_api = OauthApi(api_client())

# Call the OAuth revoke method
api_response = oauth_api.oauth_revoke(client_id=client_id, access_token=access_token)

# api_response is an OauthRevokeSuccessResponse object.
print(api_response)

# Extract success status and message
successful = api_response.successful
message = api_response.message