// Import API and UltraCart types
import { oauthApi } from '../api';
import { OauthRevokeSuccessResponse } from 'ultracart_rest_api_v2_typescript';

// Namespace-like structure using a class
export class OauthRevoke {
  /*
   * This is a last feature of the UltraCart OAuth Security Implementation.
   * oauthRevoke is used to kill an access token.
   * Call this method when a customer desires to terminate using your Developer Application.
   *
   * The first step in implementing an OAuth authorization to your UltraCart Developer Application is
   * creating a Client ID and Secret. See the following doc for instructions on doing so:
   * https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/3488907265/Developer+Applications+-+Creating+a+Client+ID+and+Secret+for+an+OAuth+Application
   */
  public static async execute(): Promise<void> {
    const clientId = "5e31ce86e17f02015a35257c47151544"; // this is given to you when you create your application (see the doc link above)
    const token = "123456789012345678901234567890"; // this is stored by your application somewhere somehow.

    try {
      // UltraCart API call with parameters as an anonymous interface
      const apiResponse = await oauthApi.oauthRevoke({
        clientId,
        token,
      });

      // apiResponse is an OauthRevokeSuccessResponse object
      const successful = apiResponse.successful;
      const message = apiResponse.message;

      console.log("OAuth Revoke Response:");
      console.log(`Successful: ${successful}`);
      console.log(`Message: ${message}`);
    } catch (ex) {
      console.log(`Error: ${(ex as Error).message}`);
      console.log((ex as Error).stack);
    }
  }
}

// Example usage (optional, remove if not needed)
OauthRevoke.execute().catch(console.error);