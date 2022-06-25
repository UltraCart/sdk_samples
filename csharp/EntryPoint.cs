using System;
using System.Linq;
using SdkSample.gift_certificate;

namespace SdkSample
{
    public static class EntryPoint
    {
        public static void Main()
        {
            // No, I'm not using reflection to do this.
            // No, I'm not using unit tests to do this.
            // Yes, hard coding all methods like this has drawbacks.
            
            
            Console.Out.WriteLine("---Gift Certificates---");
            CreateGiftCertificate.Execute();
            
        }        
    }
}