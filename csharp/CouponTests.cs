using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;


namespace SdkSample {
  [TestFixture]
  public class CouponApiTest {


    [SetUp]
    public void Init() {

      // See https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
      // const string simpleKey = "508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00";
      
      // production DEMO account
      const string simpleKey = "50f22236504c7c01684e20017c0515007eabb1e92dcdf501684e20017c051500";
      
      Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);
      Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");


    }


    // Chunking routine for handling large record sets of coupons
    private static List<Coupon> GetCouponChunk(ICouponApi api, int offset = 0, int limit = 200) {

      const string expand = null; // no expansion.  bare bones. coupon api currently has no expansion

      // ReSharper disable once RedundantArgumentDefaultValue
      var couponResponse = api.GetCoupons(offset: offset, limit: limit, expand: expand);
      // TODO if the response is not success, handle errors here.      
      return couponResponse.Success == true ? couponResponse.Coupons : new List<Coupon>();

    }


    [Test]
    public void GetCouponsTest() {


      var api = new CouponApi();
      var offset = 0;
      const int limit = 100; // why 100?  Just to show more looping.  200 is the max and a better choice.
      var stillMoreRecords = true;
      var coupons = new List<Coupon>();

      while (stillMoreRecords) {
        var chunkOfCoupons = GetCouponChunk(api, offset, limit);
        Console.WriteLine($"{chunkOfCoupons.Count} coupons retrieved.");
        coupons.AddRange(chunkOfCoupons);
        offset += limit;
        stillMoreRecords = chunkOfCoupons.Count == limit;

      }

      Console.WriteLine($"{coupons.Count} total coupons retrieved.");
      foreach (var coupon in coupons) {
        Console.WriteLine(coupon);
      }

    }


    [Test]
    public void UpdateCoupon() {

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      int couponOid = 184758;
      var api = new CouponApi();
      var couponResponse = api.GetCoupon(couponOid);
      var coupon = couponResponse.Coupon;

      coupon.Description = "Desc updated via SDK";
      coupon.AmountOffSubtotal.DiscountAmount = (decimal) 19.99;
      coupon.AmountOffSubtotal.CurrencyCode = "";
      coupon.CanBeUsedWithOtherCoupons = true;
      coupon.ExpirationDts = expirationDts;
      coupon.MerchantCode = "EURODISC";
      coupon.QuickbooksCode = "EURODISC2";
      coupon.StartDts = startDts;

      var updateResponse = api.UpdateCoupon(coupon, couponOid);
      Console.WriteLine(updateResponse);

    }


    [Test]
    public void InsertCouponCheckForDuplicateCode() {

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var api = new CouponApi();
      var coupon = new Coupon {
        CouponType = "X $ off subtotal",
        Description = "Desc inserted via SDK",
        AmountOffSubtotal = new CouponAmountOffSubtotal {
          DiscountAmount = (decimal) 25.99,
          CurrencyCode = "EUR"
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "EURODISC",
        QuickbooksCode = "EURODISC2",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      // Console.WriteLine(insertResponse);

      Assert.Equals(insertResponse.Error.DeveloperMessage, "This merchantCode is already in use by another coupon.");

    }


    [Test]
    public void InsertCoupon() {

      CreateCoupon();

    }


    private int CreateCoupon() {
      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var api = new CouponApi();
      var coupon = new Coupon {
        CouponType = "X $ off subtotal",
        Description = "Desc inserted via SDK",
        AmountOffSubtotal = new CouponAmountOffSubtotal {
          DiscountAmount = (decimal) 25.99,
          CurrencyCode = "EUR"
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "EURODISC" + randInt,
        QuickbooksCode = "EURODISC2",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);

      return insertResponse.Coupon.CouponOid ?? 0;

    }


    [Test]
    public void DeleteCoupon() {

      int couponOid = CreateCoupon();


      var api = new CouponApi();
      var deleteResponse = api.DeleteCoupon(couponOid);

      Console.WriteLine(deleteResponse);

    }


    [Test]
    public void DisplayEditorValues() {

      var api = new CouponApi();
      var editorValues = api.GetEditorValues();

      foreach (var couponType in editorValues.CouponTypes) {
        Console.WriteLine(couponType);
      }

    }


    [Test]
    public void CreateAmountOffShippingWhenPurchase() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        CouponType = "X dollars off shipping method Y with purchase of items Z",
        Description = "Desc inserted via SDK",
        AmountOffShippingWithItemsPurchase = new CouponAmountOffShippingWithItemsPurchase {
          DiscountAmount = (decimal) 14.09,
          CurrencyCode = "EUR",
          Items = new List<string> {"PDF", "BASEBALL"},
          ShippingMethods = new List<string> {"UPS: Ground", "USPS: Priority Mail"}
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);


    }


    [Test]
    public void CreateFreeItemWithMixAndMatchPurchase() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        CouponType = "I Free X with every J purchase of Y mix and match group limit L",
        Description = "Desc inserted via SDK",
        FreeItemsWithMixmatchPurchase = new CouponFreeItemsWithMixMatchPurchase {
          FreeQuantity = 5,
          FreeItem = "PDF",
          RequiredPurchaseQuantity = 20,
          RequiredPurchaseMixAndMatchGroup = "test",
          Limit = 4
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);


    }


    [Test]
    public void CreateAmountOffSubtotalWithBlockPurchase() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        CouponType = "X off subtotal with purchase block of L item Y",
        Description = "Desc inserted via SDK",
        AmountOffSubtotalWithBlockPurchase = new CouponAmountOffSubtotalWithBlockPurchase {
          DiscountAmount = (decimal) 5.99,
          CurrencyCode = "USD",
          RequiredPurchaseItem = "BONE",
          RequiredPurchaseQuantity = 100
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);


    }


    [Test]
    public void CreateAmountOffSubtotalWithItemsPurchase() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        CouponType = "X dollars off subtotal with purchase Y items",
        Description = "Desc inserted via SDK",
        AmountOffSubtotalWithItemsPurchase = new CouponAmountOffSubtotalWithItemsPurchase() {
          DiscountAmount = (decimal) 19.99,
          CurrencyCode = "USD",
          Items = new List<string> {"BONE", "PDF", "BASEBALL"},
          RequiredPurchaseQuantity = 24
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);


    }


    [Test]
    public void CreatePercentOffSubtotal() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        CouponType = "X % off subtotal",
        Description = "Desc inserted via SDK",
        PercentOffSubtotal = new CouponPercentOffSubtotal {
          DiscountPercent = (decimal) 0.205
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);


    }


    [Test]
    public void CreatePercentOffSubtotalLimit() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        CouponType = "X % off subtotal limit L",
        Description = "Desc inserted via SDK",
        PercentOffSubtotalLimit = new CouponPercentOffSubtotalLimit {
          DiscountPercent = (decimal) 0.205,
          Limit = (decimal) 100.0,
          CurrencyCode = "USD"

        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);


    }


    [Test]
    public void CreateTieredDollarOffSubtotal() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        CouponType = "Tiered Dollar Off Subtotal",
        Description = "Desc inserted via SDK",
        TieredAmountOffSubtotal = new CouponTieredAmountOffSubtotal {
          Tiers = new List<CouponTierAmount> {
            new CouponTierAmount {DiscountAmount = (decimal) 5.00, SubtotalAmount = (decimal) 10.00},
            new CouponTierAmount {DiscountAmount = (decimal) 10.00, SubtotalAmount = (decimal) 20.00},
            new CouponTierAmount {DiscountAmount = (decimal) 20.00, SubtotalAmount = (decimal) 40.00},
            new CouponTierAmount {DiscountAmount = (decimal) 40.00, SubtotalAmount = (decimal) 80.00}
          },
          Items = new List<string> {"PDF", "BASEBALL"},
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);


    }


    [Test]
    public void CreateTieredPercentOffSubtotal() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        CouponType = "Tiered Percent Off Subtotal",
        Description = "Desc inserted via SDK",
        TieredPercentOffSubtotal = new CouponTieredPercentOffSubtotal() {
          Tiers = new List<CouponTierPercent> {
            new CouponTierPercent {DiscountPercent = (decimal) 0.10, SubtotalAmount = (decimal) 10.00},
            new CouponTierPercent {DiscountPercent = (decimal) 0.20, SubtotalAmount = (decimal) 20.00},
            new CouponTierPercent {DiscountPercent = (decimal) 0.40, SubtotalAmount = (decimal) 40.00},
            new CouponTierPercent {DiscountPercent = (decimal) 0.80, SubtotalAmount = (decimal) 80.00}
          },
          Items = new List<string> {"PDF", "BASEBALL"},
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);
    }


    [Test]
    public void CreateTieredAmountOffItem() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        CouponType = "Tiered $ off item Z limit L",
        Description = "Desc inserted via SDK",
        TieredAmountOffItem = new CouponTieredAmountOffItem {
          Item = "PDF",
          Limit = 99,
          Tiers = new List<CouponTierQuantityAmount> {
            new CouponTierQuantityAmount {DiscountAmount = (decimal) 2.00, ItemQuantity = 11},
            new CouponTierQuantityAmount {DiscountAmount = (decimal) 4.00, ItemQuantity = 22},
            new CouponTierQuantityAmount {DiscountAmount = (decimal) 6.00, ItemQuantity = 33},
            new CouponTierQuantityAmount {DiscountAmount = (decimal) 8.00, ItemQuantity = 44},
          }
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);
    }


    [Test]
    public void CreateAmountOffShipping() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        CouponType = "X $ off shipping method Y",
        Description = "Desc inserted via SDK",
        AmountOffShipping = new CouponAmountOffShipping {
          DiscountAmount = (decimal) 9.99,
          CurrencyCode = "EUR",
          ShippingMethods = new List<string> {"UPS: Ground", "USPS: Priority Mail"}
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);
    }


    [Test]
    public void CreatePercentOffShipping() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        CouponType = "X % off shipping method Y",
        Description = "Desc inserted via SDK",
        PercentOffShipping = new CouponPercentOffShipping {
          DiscountPercent = (decimal) 0.20,
          ShippingMethods = new List<string> {"UPS: Ground", "USPS: Priority Mail"}
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);
    }


    [Test]
    public void CreateFreeShipping() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        Description = "Desc inserted via SDK",
        FreeShipping = new CouponFreeShipping() {
          ShippingMethods = new List<string> {"UPS: Ground", "USPS: Priority Mail"}
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);
    }


    [Test]
    public void CreateTieredPercentOffShipping() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        Description = "Desc inserted via SDK",
        TieredPercentOffShipping = new CouponTieredPercentOffShipping {
          ShippingMethods = new List<string> {"UPS: Ground", "USPS: Priority Mail"},
          Tiers = new List<CouponTierPercent> {
            new CouponTierPercent {DiscountPercent = (decimal) 0.10, SubtotalAmount = (decimal) 10.00},
            new CouponTierPercent {DiscountPercent = (decimal) 0.20, SubtotalAmount = (decimal) 20.00},
            new CouponTierPercent {DiscountPercent = (decimal) 0.40, SubtotalAmount = (decimal) 40.00},
            new CouponTierPercent {DiscountPercent = (decimal) 0.80, SubtotalAmount = (decimal) 80.00}
          },
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);
    }


    [Test]
    public void CreateDiscountItemWithItemPurchase() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        Description = "Desc inserted via SDK",
        DiscountItemWithItemPurchase = new CouponDiscountItemWithItemPurchase {
          DiscountItem = "PDF",
          RequiredPurchaseItem = "BONE",
          DiscountPrice = (decimal) 1.99,
          Limit = 5,
          CurrencyCode = "USD"

        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);
    }


    [Test]
    public void CreatePercentOffItemAndFreeShipping() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        Description = "Desc inserted via SDK",
        PercentOffItemsAndFreeShipping = new CouponPercentOffItemsAndFreeShipping {
          Items = new List<string> {"BONE", "PDF", "BASEBALL"},
          ExcludedItems = new List<string> {"AOITEM"},
          DiscountPercent = (decimal) 0.20
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);
    }


    [Test]
    public void CreatePercentOffItemWithItemsQuantityPurchase() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        Description = "Desc inserted via SDK",
        PercentOffItemWithItemsQuantityPurchase = new CouponPercentOffItemWithItemsQuantityPurchase {
          Items = new List<string> {"BONE", "PDF", "BASEBALL"},
          RequiredPurchaseItems = new List<string> {"AOITEM"},
          RequiredPurchaseQuantity = 20,
          DiscountPercent = (decimal) 0.20,
          Limit = 5
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);
    }


    [Test]
    public void CreateMultipleAmountsOffItems() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        Description = "Desc inserted via SDK",
        MultipleAmountsOffItems = new CouponMultipleAmountsOffItems {
          Discounts = new List<CouponTierItemDiscount> {
            new CouponTierItemDiscount {
              Items = new List<string> {"BONE", "PDF"},
              DiscountAmount = (decimal) 5.00
            },
            new CouponTierItemDiscount {
              Items = new List<string> {"BASEBALL"},
              DiscountAmount = (decimal) 10.00
            },
            new CouponTierItemDiscount {
              Items = new List<string> {"AOITEM"},
              DiscountAmount = (decimal) 20.00
            }
          },
          Limit = 5
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);
    }


    [Test]
    public void CreateFreeItemsWithItemPurchase() {

      var api = new CouponApi();

      Random random = new Random();
      int randInt = random.Next(1000, 2000);

      var startDts = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-ddTHH:mm:ssZ");
      var expirationDts = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-ddTHH:mm:ssZ");

      var coupon = new Coupon {
        Description = "Desc inserted via SDK",
        FreeItemsWithItemPurchase = new CouponFreeItemsWithItemPurchase {
          FreeQuantity = 5,
          FreeItem = "BONE",
          RequiredPurchaseQuantity = 10,
          RequiredPurchaseItem = "PDF",
          Limit = 200
        },
        CanBeUsedWithOtherCoupons = true,
        ExpirationDts = expirationDts,
        MerchantCode = "SDKTEST" + randInt,
        QuickbooksCode = "SDKTEST",
        StartDts = startDts
      };


      var insertResponse = api.InsertCoupon(coupon);
      Console.WriteLine(insertResponse);
    }


    [Test]
    public void GenerateCouponCodes() {

      var api = new CouponApi();
      const int couponOid = 138228;

      CouponCodesRequest ccr = new CouponCodesRequest {
        ExpirationSeconds = 38000,
        Quantity = 20
      };

      var codesResponse = api.GenerateCouponCodes(couponOid, ccr);
      var codes = codesResponse.CouponCodes;

      foreach (var code in codes) {
        Console.WriteLine(code);
      }

    }

    
    
    [Test]
    public void GenerateCouponCodes2() {

      var api = new CouponApi();
      const string merchantCode = "10OFF";

      CouponCodesRequest ccr = new CouponCodesRequest {
        ExpirationSeconds = 38000,
        Quantity = 20
      };

      var codesResponse = api.GenerateOneTimeCodesByMerchantCode(merchantCode, ccr);
      var codes = codesResponse.CouponCodes;

      foreach (var code in codes) {
        Console.WriteLine(code);
      }

    }
    
    

    //////////////////////////////////////////////////////////    
  }
}