// Import API and UltraCart types
import { couponApi } from '../api.js';
import { DateTime } from 'luxon';

// Namespace-like structure using a class (TypeScript doesn't have namespaces like C#, but this mimics it)
export class GetCouponsByQuery {
  /*
   * Retrieves coupons by query. Can filter on specific coupons or return back all coupons. Supports pagination.
   * A note about the coupon type below. Those are string literals representing coupons. This method is used in UltraCart's
   * backend, and it uses a dropdown box for that value showing friendly descriptions of them.
   *
   * It's not anticipated a merchant would need to query by coupon type, but in the event you do, here's the list of constants:
   * "BOGO limit L"
   * "Free shipping method Y"
   * "Free shipping method Y with purchase of items Z"
   * "Free shipping method Y with subtotal Z"
   * "Free shipping on item Z"
   * "Free X with purchase of Y dollars limit L"
   * "Free X with purchase of Y dollars limit L and shipping Z"
   * "Free X with purchase of Y limit L"
   * "Free X with purchase of Y limit L and free shipping"
   * "I Free X with every J purchase of Y limit L"
   * "I Free X with every J purchase of Y mix and match group limit L"
   * "Item X for Y with purchase of Z limit L"
   * "multiple X $ off item Z limit L"
   * "No discount"
   * "Tiered Dollar Off Subtotal"
   * "Tiered % off items Z limit L"
   * "Tiered $ off item Z limit L"
   * "Tiered Percent off shipping methods Y with subtotal Z"
   * "Tiered Percent Off Subtotal"
   * "X dollars off shipping method Y with purchase of items Z"
   * "X dollars off subtotal with purchase Y items"
   * "X $ for item Z limit L"
   * "X more loyalty cashback"
   * "X more loyalty points"
   * "X % off item Z and free shipping"
   * "X $ off item Z limit L"
   * "X % off item Z limit L"
   * "X % off msrp item Z limit L"
   * "X % off retail item Z limit L"
   * "X $ off shipping method Y"
   * "X % off shipping method Y"
   * "X $ off subtotal"
   * "X % off subtotal"
   * "X $ off subtotal and shipping"
   * "X % off subtotal free shipping method Y"
   * "X % off subtotal limit L"
   * "X off subtotal with purchase block of L item Y"
   * "X % off subtotal with purchase of item Y"
   * "X % off subtotal with purchase of Y"
   * "X $ off subtotal with Y $ purchase"
   * "X $ off subtotal with Y $ purchase and free shipping"
   * "X % off Y with purchase Z limit L"
   * "X % off Y with T purchase Z limit L"
   * "X percent more loyalty points"
   * "X $ shipping method Y with subtotal Z"
   * "X ? subtotal"
   */
  static async execute() {
    console.log(`--- GetCouponsByQuery ---`);

    try {
      const coupons = [];

      let iteration = 1;
      let offset = 0;
      const limit = 200;
      let moreRecordsToFetch = true;

      while (moreRecordsToFetch) {
        console.log(`executing iteration ${iteration}`);
        const chunkOfCoupons = await this.getCouponChunk(offset, limit);
        coupons.push(...chunkOfCoupons);
        offset += limit;
        moreRecordsToFetch = chunkOfCoupons.length === limit;
        iteration++;
      }

      // Display the coupons
      for (const coupon of coupons) {
        console.log(coupon);
      }

      console.log(`Total coupons retrieved: ${coupons.length}`);
    } catch (ex) {
      console.log(`Error: ${ex.message}`);
      console.log(ex.stack);
    }
  }

  /**
   * Returns a chunk of coupons based on query parameters
   * @param offset Pagination offset
   * @param limit Maximum number of records to return
   * @returns List of matching coupons
   */
  static async getCouponChunk(offset, limit) {
    // Create coupon API instance (assuming API key is handled in '../api')
    const apiInstance = couponApi;

    const query = {
      merchant_code: "10OFF", // supports partial matching
      description: "Saturday", // supports partial matching
      // couponType: null, // see the note at the top of this sample
      // startDtsBegin: DateTime.now().setZone('America/New_York').minus({ days: 2000 }).toISO(), // 2,000 days ago
      // startDtsEnd: DateTime.now().setZone('America/New_York').toISO(),
      // expirationDtsBegin: null,
      // expirationDtsEnd: null,
      // affiliateOid: 0, // this requires an affiliate_oid. If you need help finding an affiliate's oid, contact support
      exclude_expired: true,
    };

    const expand = undefined; // coupons do not have expansions
    const sort = "merchant_code"; // Possible sorts: "coupon_type", "merchant_code", "description", "start_dts", "expiration_dts", "quickbooks_code"

    // UltraCart API call with parameters as an anonymous interface
    const opts = {
      _limit: limit,
      _offset: offset,
      _sort: sort,
      _expand: expand,
    };

    const apiResponse = await new Promise((resolve, reject) => {
      apiInstance.getCouponsByQuery(query, opts, function (error, data, response) {
        if (error) {
          reject(error);
        } else {
          resolve(data, response);
        }
      });
    });

    if (apiResponse.coupons) {
      return apiResponse.coupons;
    }
    return [];
  }
}