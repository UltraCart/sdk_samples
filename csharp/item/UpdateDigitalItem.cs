using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using System;
using com.ultracart.admin.v2.Client;

namespace SdkSample.item
{
    public class UpdateDigitalItem
    {
        public static void Execute()
        {
            try
            {
                int digitalItemOid = ItemFunctions.InsertSampleDigitalItem();

                ItemApi itemApi = new ItemApi(Constants.ApiKey);
                ItemDigitalItemResponse apiResponse = itemApi.GetDigitalItem(digitalItemOid);
                ItemDigitalItem digitalItem = apiResponse.DigitalItem;

                digitalItem.Description = "I have updated the description to this sentence.";
                digitalItem.ClickWrapAgreement = "You hereby agree that the earth is round.  No debate.";

                itemApi.UpdateDigitalItem(digitalItemOid, digitalItem);

                ItemFunctions.DeleteSampleDigitalItem(digitalItemOid);
            }
            catch (ApiException e)
            {
                Console.WriteLine("An ApiException occurred.  Please review the following error:");
                Console.WriteLine(e); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }


    }
}