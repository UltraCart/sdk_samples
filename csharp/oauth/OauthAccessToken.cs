using System.Web;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.oauth
{
    public class OauthAccessToken
    {
        /*
         * The first step in implementing an OAuth authorization to your UltraCart Developer Application is
         * creating a Client ID and Secret. See the following doc for instructions on doing so:
         * https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/3488907265/Developer+Applications+-+Creating+a+Client+ID+and+Secret+for+an+OAuth+Application
         * 
         * The second step is to construct an authorize url for your customers to follow and authorize your application.
         * See the oauthAuthorize.php for an example on constructing that url.
         * 
         * This method, OAuth.oauthAccessToken() will be called from within your redirect script, i.e. that web page the
         * customer is redirected to by UltraCart after successfully authorizing your application.
         * 
         * This example illustrates how to retrieve the code parameter and exchange it for an access_token and refresh_token.
         * 
         * Once you have your Client ID and Secret created, our OAuth security follows the industry standards.
         * 1. Construct an authorize url for your customers.
         * 2. Your customers will follow the link and authorize your application.
         * 3. Store their oauth credentials as best fits your application.
         * 
         * Parameters this script should expect:
         * code -> used to exchange for an access token
         * state -> whatever you passed in your authorize url
         * error -> if you have a problem with your application configure. Possible values are:
         *     invalid_request -> your authorize url has expired
         *     access_denied -> user said 'no' and did not grant access.
         * 
         * Parameters you will use to retrieve a token:
         * code -> the value provided as a query parameter from UltraCart, required if grant_type is 'authorization_code'
         * client_id -> your client id (see doc link at top of this file)
         * grant_type -> 'authorization_code' or 'refresh_token'
         * redirect_url -> The URI that you redirect the browser to start the authorization process
         * refresh_token -> if grant_type = 'refresh_token', you have to provide the refresh token. makes sense, yes?
         * 
         * See OauthTokenResponse for fields that are returned from this call.
         * All SDKs have the same field names with slight differences in capitalization and underscores.
         * https://github.com/UltraCart/rest_api_v2_sdk_csharp/blob/master/src/com.ultracart.admin.v2/Model/OauthTokenResponse.cs
         */
        public static void Execute()
        {
            string clientId = "5e31ce86e17f02015a35257c47151544";  // this is given to you when you create your application (see the doc link above)
            string grantType = "authorization_code";
            string redirectUrl = "https://www.mywebsite.com/oauth/redirect_here.php";
            string state = "denmark";  // this is whatever you used when you created your authorize url (see oauthAuthorize.php)

            // Note: You'll need to implement your own method to get the code from query parameters
            string code = HttpContext.Current.Request.QueryString["code"];
            string refreshToken = null;

            OauthApi oauthApi = new OauthApi(Constants.ApiKey);
            OauthTokenResponse apiResponse = oauthApi.OauthAccessToken(clientId, grantType, code, redirectUrl, refreshToken);

            // apiResponse is an OauthTokenResponse object
            string newRefreshToken = apiResponse.RefreshToken;
            string expiresIn = apiResponse.ExpiresIn;
        }
    }
}