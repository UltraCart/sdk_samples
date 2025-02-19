using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.item
{
    public class ItemFunctions
    {
        /// <summary>
        /// Creates a sample item with random ID
        /// </summary>
        /// <returns>The newly created item id</returns>
        public static string InsertSampleItem()
        {
            Random random = new Random();
            string chars = "ABCDEFGH";
            char[] stringChars = new char[chars.Length];

            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            string rand = new string(stringChars);
            string itemId = $"sample_{rand}";

            Console.WriteLine($"InsertSampleItem will attempt to create item {itemId}");
            ItemApi itemApi = Samples.GetItemApi();

            Item newItem = new Item();
            newItem.MerchantItemId = itemId;

            ItemPricing pricing = new ItemPricing();
            pricing.Cost = 9.99m;
            newItem.Pricing = pricing;

            newItem.Description = $"Sample description for item {itemId}";

            ItemContentMultimedia multimedia = new ItemContentMultimedia();
            multimedia.Url = "https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png";
            multimedia.Code = "default"; // <-- use 'default' to make this the default item.
            multimedia.Description = "Some random image i nabbed from wikipedia";

            ItemContent content = new ItemContent();
            content.Multimedia = new List<ItemContentMultimedia> { multimedia }; // <- notice this is an array
            newItem.Content = content;

            string expand = "content.multimedia"; // I want to see the multimedia returned on the newly created object.

            Console.WriteLine("InsertItem request object follows:");
            Console.WriteLine(newItem);

            ItemResponse apiResponse = itemApi.InsertItem(newItem, expand);

            Console.WriteLine("InsertItem response object follows:");
            Console.WriteLine(apiResponse);

            return apiResponse.Item.MerchantItemId;
        }

        
        /// <summary>
        /// Creates a sample item with random ID
        /// </summary>
        /// <returns>The newly created merchant item oid</returns>
        public static int InsertSampleItemAndGetOid()
        {
            Random random = new Random();
            string chars = "ABCDEFGH";
            char[] stringChars = new char[chars.Length];

            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            string rand = new string(stringChars);
            string itemId = $"sample_{rand}";

            Console.WriteLine($"InsertSampleItem will attempt to create item {itemId}");
            ItemApi itemApi = Samples.GetItemApi();

            Item newItem = new Item();
            newItem.MerchantItemId = itemId;

            ItemPricing pricing = new ItemPricing();
            pricing.Cost = 9.99m;
            newItem.Pricing = pricing;

            newItem.Description = $"Sample description for item {itemId}";

            ItemContentMultimedia multimedia = new ItemContentMultimedia();
            multimedia.Url = "https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png";
            multimedia.Code = "default"; // <-- use 'default' to make this the default item.
            multimedia.Description = "Some random image i nabbed from wikipedia";

            ItemContent content = new ItemContent();
            content.Multimedia = new List<ItemContentMultimedia> { multimedia }; // <- notice this is an array
            newItem.Content = content;

            string expand = "content.multimedia"; // I want to see the multimedia returned on the newly created object.

            Console.WriteLine("InsertItem request object follows:");
            Console.WriteLine(newItem);

            ItemResponse apiResponse = itemApi.InsertItem(newItem, expand);

            Console.WriteLine("InsertItem response object follows:");
            Console.WriteLine(apiResponse);

            return apiResponse.Item.MerchantItemOid;
        }

        
        /// <summary>
        /// Deletes a sample item by its oid
        /// </summary>
        /// <param name="merchantItemOid">The item oid to be deleted</param>
        public static void DeleteSampleItemByOid(int merchantItemOid)
        {
            ItemApi itemApi = Samples.GetItemApi();
            Console.WriteLine($"Calling DeleteItem({merchantItemOid})");
            itemApi.DeleteItem(merchantItemOid);
        }
        
        
        /// <summary>
        /// Deletes a sample item by its oid
        /// </summary>
        /// <param name="merchantItemOid">The item id to be deleted</param>
        public static void DeleteSampleItem(string merchantItemId)
        {
            ItemApi itemApi = Samples.GetItemApi();
            int merchantItemOid = itemApi.GetItemByMerchantItemId(merchantItemId).Item.MerchantItemOid;

            Console.WriteLine($"Calling DeleteItem({merchantItemOid})");
            itemApi.DeleteItem(merchantItemOid);
        }

        /// <summary>
        /// Creates a sample digital item
        /// </summary>
        /// <param name="externalId">Optional external ID for the digital item</param>
        /// <returns>The digital item oid for the newly created item</returns>
        public static int InsertSampleDigitalItem(string externalId = null)
        {
            string imageUrl =
                "https://upload.wikimedia.org/wikipedia/commons/b/b7/Earth_%2816530938850%29.jpg"; // picture of the earth

            ItemDigitalItem digitalItem = new ItemDigitalItem();
            digitalItem.ImportFromUrl = imageUrl;
            digitalItem.Description = "The Earth";
            digitalItem.ClickWrapAgreement = "By purchasing this item, you agree that it is Earth";

            if (externalId != null)
            {
                digitalItem.ExternalId = externalId;
            }

            Console.WriteLine("InsertDigitalItem request object follows:");
            Console.WriteLine(digitalItem);

            ItemApi itemApi = Samples.GetItemApi();
            ItemDigitalItemResponse apiResponse = itemApi.InsertDigitalItem(digitalItem);

            Console.WriteLine("InsertDigitalItem response object follows:");
            Console.WriteLine(apiResponse);

            return apiResponse.DigitalItem.DigitalItemOid;
        }

        /// <summary>
        /// Deletes a sample digital item by its oid
        /// </summary>
        /// <param name="digitalItemOid">The primary key of the digital item to be deleted</param>
        public static void DeleteSampleDigitalItem(int digitalItemOid)
        {
            ItemApi itemApi = Samples.GetItemApi();

            Console.WriteLine($"Calling DeleteDigitalItem({digitalItemOid})");
            itemApi.DeleteDigitalItem(digitalItemOid);
        }
    }
}