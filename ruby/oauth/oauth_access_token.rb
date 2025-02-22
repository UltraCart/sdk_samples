require 'ultracart_api'
require_relative '../constants'

=begin

The first step in implementing an OAuth authorization to your UltraCart Developer Application is
creating a Client ID and Secret.  See the following doc for instructions on doing so:
https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/3488907265/Developer+Applications+-+Creating+a+Client+ID+and+Secret+for+an+OAuth+Application

The second step is to construct an authorize url for your customers to follow and authorize your application.
See the oauthAuthorize.rb for an example on constructing that url.

This method, OAuth.oauth_access_token() will be called from within your redirect script, i.e. that web page the
customer is redirected to by UltraCart after successfully authorizing your application.

This example illustrates how to retrieve the code parameter and exchange it for an access_token and refresh_token.

Once you have your Client ID and Secret created, our OAuth security follows the industry standards.
1. Construct an authorize url for your customers.
2. Your customers will follow the link and authorize your application.
3. Store their oauth credentials as best fits your application.

Parameters this script should expect:
code -> used to exchange for an access token
state -> whatever you passed in your authorize url
error -> if you have a problem with your application configure.  Possible values are:
    invalid_request -> your authorize url has expired
    access_denied -> user said 'no' and did not grant access.

Parameters you will use to retrieve a token:
code -> the value provided as a query parameter from UltraCart, required if grant_type is 'authorization_code'
client_id -> your client id (see doc link at top of this file)
grant_type -> 'authorization_code' or 'refresh_token'
redirect_url -> The URI that you redirect the browser to start the authorization process
refresh_token -> if grant_type = 'refresh_token', you have to provide the refresh token.  makes sense, yes?

See OauthTokenResponse for fields that are returned from this call.
All SDKs have the same field names with slight differences in capitalization and underscores.
https://github.com/UltraCart/rest_api_v2_sdk_csharp/blob/master/src/com.ultracart.admin.v2/Model/OauthTokenResponse.cs

=end

client_id = "5e31ce86e17f02015a35257c47151544"  # this is given to you when you create your application (see the doc link above)
grant_type = "authorization_code"
redirect_url = "https://www.mywebsite.com/oauth/redirect_here.php"
state = "denmark"  # this is whatever you used when you created your authorize url (see oauthAuthorize.rb)

code = params['code']  # Assuming this is running in a web framework that provides params
refresh_token = nil

oauth_api = UltracartClient::OauthApi.new_using_api_key(Constants::API_KEY)
api_response = oauth_api.oauth_access_token(client_id, grant_type, code, redirect_url, refresh_token)

# api_response is an OauthTokenResponse object.
puts api_response.inspect
refresh_token = api_response.refresh_token
expires_in = api_response.expires_in