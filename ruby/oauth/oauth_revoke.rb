require 'ultracart_api'
require_relative '../constants'

=begin

This is a last feature of the UltraCart OAuth Security Implementation.
oauthRevoke is used to kill an access token.
Call this method when a customer desires to terminate using your Developer Application.


The first step in implementing an OAuth authorization to your UltraCart Developer Application is
creating a Client ID and Secret.  See the following doc for instructions on doing so:
https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/3488907265/Developer+Applications+-+Creating+a+Client+ID+and+Secret+for+an+OAuth+Application

=end

client_id = "5e31ce86e17f02015a35257c47151544"  # this is given to you when you create your application (see the doc link above)
access_token = "123456789012345678901234567890" # this is stored by your application somewhere somehow.

oauth_api = UltracartClient::OauthApi.new_using_api_key(Constants::API_KEY)
api_response = oauth_api.oauth_revoke(client_id, access_token)

# api_response is an OauthRevokeSuccessResponse object.
puts api_response.inspect
successful = api_response.successful
message = api_response.message