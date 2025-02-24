// Import API and UltraCart types
import { oauthApi } from '../api.js';

// Namespace-like structure using a class
export class OauthAccessToken {
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
  static async execute(queryParams) {
    const clientId = "5e31ce86e17f02015a35257c47151544"; // this is given to you when you create your application (see the doc link above)
    const grantType = "authorization_code";
    const redirectUri = "https://www.mywebsite.com/oauth/redirect_here.php";
    const state = "denmark"; // this is whatever you used when you created your authorize url (see oauthAuthorize.php)

    // Note: In a real application, you'd get 'code' from query parameters in your server or client context
    const code = queryParams.code ?? undefined; // Example: from URL query string in a redirect handler
    const refreshToken = undefined;

    try {
      if (!code && grantType === "authorization_code") {
        throw new Error("No code provided for authorization_code grant type");
      }

      // UltraCart API call with parameters as an anonymous object
      const apiResponse = await new Promise((resolve, reject) => {
        oauthApi.oauthAccessToken(
          clientId,
          grantType, {
          code: code,
          redirectUri: redirectUri,
          refreshToken: refreshToken,
        }, function (error, data, response) {
          if (error) {
            reject(error);
          } else {
            resolve(data, response);
          }
        });
      });

      // apiResponse is an OauthTokenResponse object
      const newRefreshToken = apiResponse.refresh_token;
      const expiresIn = apiResponse.expires_in;

      console.log("OAuth Token Response:");
      console.log(`Refresh Token: ${newRefreshToken}`);
      console.log(`Expires In: ${expiresIn}`);
    } catch (ex) {
      console.log(`Error: ${ex.message}`);
      console.log(ex.stack);
    }
  }
}

// Example usage (for a Node.js server context, adjust as needed)
import { URL } from 'url'; // Node.js built-in module
const exampleQuery = new URL('https://example.com?code=abc123&state=denmark').searchParams;
OauthAccessToken.execute({
  code: exampleQuery.get('code') ?? undefined,
  state: exampleQuery.get('state') ?? undefined,
  error: exampleQuery.get('error') ?? undefined,
}).catch(console.error);