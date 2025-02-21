from ultracart.apis import CouponApi
from ultracart.models import CouponQuery
from samples import api_client

# Initialize the API
coupon_api = CouponApi(api_client())


def get_coupon_chunk(coupon_api: CouponApi, offset: int, limit: int) -> list:
    """
    Retrieve a chunk of coupons based on the specified query parameters.

    Args:
        coupon_api: The CouponApi instance
        offset: Starting position for the query
        limit: Maximum number of records to return

    Returns:
        List of coupon objects
    """
    query = CouponQuery()
    query.merchant_code = '10OFF'  # supports partial matching
    query.description = 'Saturday'  # supports partial matching
    # query.coupon_type = None  # see the note at the top of the sample
    # query.start_dts_begin = (datetime.now() - timedelta(days=2000)).strftime('%Y-%m-%dT00:00:00+00:00')
    # query.start_dts_end = datetime.now().strftime('%Y-%m-%dT00:00:00+00:00')
    # query.expiration_dts_begin = None
    # query.expiration_dts_end = None
    # query.affiliate_oid = 0  # this requires an affiliate_oid. Contact support for help finding an affiliate's oid
    query.exclude_expired = True

    expand = None  # coupons do not have expansions
    sort = "merchant_code"  # Possible sorts: "coupon_type", "merchant_code", "description", "start_dts", "expiration_dts", "quickbooks_code"

    api_response = coupon_api.get_coupons_by_query(query, limit=limit, offset=offset, sort=sort, expand=expand)
    return api_response.coupons if api_response.coupons is not None else []


def main():
    coupons = []
    iteration = 1
    offset = 0
    limit = 200
    more_records_to_fetch = True

    while more_records_to_fetch:
        print(f"executing iteration {iteration}")
        chunk_of_coupons = get_coupon_chunk(coupon_api, offset, limit)
        coupons.extend(chunk_of_coupons)
        offset += limit
        more_records_to_fetch = len(chunk_of_coupons) == limit
        iteration += 1

    print(coupons)  # This could get verbose...


if __name__ == "__main__":
    main()