using com.ultracart.admin.v2.Client;

namespace SdkSample {
  public static class UltraCartInit {
    public static void Init() {
      // See https://www.ultracart.com/api/#authentication.html
      // See https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
      // See https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
      // const string simpleKey = "508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00";

      // production DEMO account
      const string simpleKey = "50f22236504c7c01684e20017c0515007eabb1e92dcdf501684e20017c051500";


      if (Configuration.Default.ApiKey.ContainsKey("x-ultracart-simple-key")) {
        Configuration.Default.ApiKey["x-ultracart-simple-key"] = simpleKey;
      }
      else {
        Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);
      }

      // https://www.ultracart.com/api/#versioning.html
      if (Configuration.Default.DefaultHeader.ContainsKey("X-UltraCart-Api-Version")) {
        Configuration.Default.DefaultHeader["X-UltraCart-Api-Version"] = "2017-03-01";
      }
      else {
        Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");
      }
    }
  }
}