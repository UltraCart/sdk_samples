using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.oauth
{
    public class OauthRevoke 
    {
        /*
         * This is a last feature of the UltraCart OAuth Security Implementation.
         * oauthRevoke is used to kill an access token.
         * Call this method when a customer desires to terminate using your Developer Application.
         *
         * The first step in implementing an OAuth authorization to your UltraCart Developer Application is
         * creating a Client ID and Secret. See the following doc for instructions on doing so:
         * https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/3488907265/Developer+Applications+-+Creating+a+Client+ID+and+Secret+for+an+OAuth+Application
         */
        public static void Execute()
        {
            string clientId = "5e31ce86e17f02015a35257c47151544";  // this is given to you when you create your application (see the doc link above)
            string accessToken = "123456789012345678901234567890"; // this is stored by your application somewhere somehow.

            OauthApi oauthApi = new OauthApi(Constants.ApiKey);
            OauthRevokeSuccessResponse apiResponse = oauthApi.OauthRevoke(clientId, accessToken);

            // apiResponse is an OauthRevokeSuccessResponse object
            bool successful = apiResponse.Successful;
            string message = apiResponse.Message;
        }
    }
}