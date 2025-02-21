# Create a Simple Key: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
# Error help: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/39077885/Troubleshooting+API+Errors
# Additional Docs: https://www.ultracart.com/api/#introduction.html

# This is an old example.  Please see get_coupons_by_query as they do essentially the same thing, but
# get_coupons_by_query is easier to use.

from ultracart.apis import CouponApi
from ultracart.exceptions import ApiException
from ultracart.models import Coupon
from typing import List
from samples import api_client


def get_coupons_chunk(coupon_api: CouponApi, offset: int = 0, limit: int = 200) -> List[Coupon]:
    """
    Returns a block of customers

    Args:
        coupon_api: CouponApi instance
        offset: pagination variable
        limit: pagination variable. max server will allow is 200

    Returns:
        List of Coupon objects

    Raises:
        ApiException
    """

    # TODO: consider using get_coupons_by_query() as it does not require all search parameters
    merchant_code = None
    description = None
    coupon_type = None
    start_date_begin = None
    start_date_end = None
    expiration_date_begin = None
    expiration_date_end = None
    affiliate_oid = None
    exclude_expired = None

    limit = limit
    offset = offset
    sort = None
    expand = None  # getCoupons doesn't have any expansions. full record is always returned.

    get_response = coupon_api.get_coupons(merchant_code, description, coupon_type, start_date_begin, start_date_end,
                                          expiration_date_begin, expiration_date_end, affiliate_oid, exclude_expired,
                                          limit=limit, offset=offset, sort=sort, expand=expand)
    if get_response.success:
        return get_response.coupons

    return []


def main():
    coupon_api = CouponApi(api_client())
    coupons = []

    try:
        iteration = 1
        offset = 0
        limit = 200
        need_more_records = True

        while need_more_records:
            print(f"executing iteration #{iteration}")
            iteration += 1

            block_of_customers = get_coupons_chunk(coupon_api, offset, limit)
            coupons.extend(block_of_customers)

            offset += limit
            need_more_records = len(block_of_customers) == limit
            # time.sleep(1)  # I'm testing rate limiter headers. this should probably be uncommented. maybe.

    except ApiException as e:
        print('API Exception when calling CouponApi->get_coupons:', e.message)
        print(e.response_body)
    except Exception as e:
        print('Exception when calling CouponApi->get_coupons:', str(e))

    print(coupons)


if __name__ == '__main__':
    main()