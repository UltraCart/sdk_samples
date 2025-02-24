// Namespace-like structure using a class
export class OauthAuthorize {
  /*
   * Note: You will never call this method from any sdk. This method is not meant to be called from your application.
   * Our sdk_samples are auto generated by our framework. Therefore, this sample file was created automatically.
   * But, this is not a sdk function. The underlying endpoint is what your application should direct users to in order
   * to authorize your application.
   *
   * The first step in implementing an OAuth authorization to your UltraCart Developer Application is
   * creating a Client ID and Secret. See the following doc for instructions on doing so:
   * https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/3488907265/Developer+Applications+-+Creating+a+Client+ID+and+Secret+for+an+OAuth+Application
   *
   * Once you have your Client ID and Secret created, our OAuth security follows the industry standards.
   * 1. Construct an authorize url for your customers.
   * 2. Your customers will follow the link and authorize your application.
   * 3. Store their oauth credentials as best fits your application.
   *
   * This sample shows how someone might construct the authorize url. Note that we don't provide the scope here.
   * We set the scope when we created the developer application (generated client id and secret). See the above doc link
   * for details.
   */
  public static execute(): string {
    const clientId = "5e31ce86e17f02015a35257c47151544";
    const state = "denmark"; // this is whatever you want it to be. random string. but it is required.
    const redirectUrl = "https://www.mywebsite.com/oauth/redirect_here.php";
    const responseType = "code"; // for ultracart applications, this must always be 'code'

    // Construct query parameters
    const parameters = new URLSearchParams();
    parameters.set("response_type", responseType);
    parameters.set("client_id", clientId);
    parameters.set("redirect_uri", redirectUrl);
    parameters.set("state", state);

    const url = `https://secure.ultracart.com/rest/v2/oauth/authorize?${parameters.toString()}`;

    // Note: Implementation of redirect will depend on your web framework
    // For Node.js (e.g., Express): res.redirect(url);
    // For browser: window.location.href = url;
    return url;
  }
}

// Example usage (adjust based on your environment)
console.log(OauthAuthorize.execute());

// For Node.js (Express example, uncomment if applicable):
/*
import express from 'express';
const app = express();
app.get('/oauth/authorize', (req, res) => {
  const url = OauthAuthorize.execute();
  res.redirect(url);
});
*/

// For browser (uncomment if applicable):
/*
window.location.href = OauthAuthorize.execute();
*/