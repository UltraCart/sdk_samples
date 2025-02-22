require_relative '../constants'
require 'ultracart_api'

# Create a Simple Key: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
# Error help: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/39077885/Troubleshooting+API+Errors
# Additional Docs: https://www.ultracart.com/api/#introduction.html

# This is an old example.  Please see get_coupons_by_query as they do essentially the same thing, but
# get_coupons_by_query is easier to use.

# returns a block of customers
# @param coupon_api [UltracartClient::CouponApi]
# @param offset [Integer] pagination variable
# @param limit [Integer] pagination variable.  max server will allow is 200
# @return [Array<UltracartClient::Coupon>]
def get_coupons_chunk(coupon_api, offset = 0, limit = 200)
  # TODO: consider using get_coupons_by_query() as it does not require all search parameters
  merchant_code = nil
  description = nil
  coupon_type = nil
  start_date_begin = nil
  start_date_end = nil
  expiration_date_begin = nil
  expiration_date_end = nil
  affiliate_oid = nil
  exclude_expired = nil

  # getCoupons doesn't have any expansions. full record is always returned.
  opts = {
    merchant_code: merchant_code,
    description: description,
    coupon_type: coupon_type,
    start_date_begin: start_date_begin,
    start_date_end: start_date_end,
    expiration_date_begin: expiration_date_begin,
    expiration_date_end: expiration_date_end,
    affiliate_oid: affiliate_oid,
    exclude_expired: exclude_expired,
    _limit: limit,
    _offset: offset,
    _sort: nil,
    _expand: nil
  }

  get_response = coupon_api.get_coupons(opts)

  return get_response.coupons if get_response.success

  []
end

begin
  coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
  coupons = []

  iteration = 1
  offset = 0
  limit = 200
  need_more_records = true

  while need_more_records
    puts "executing iteration ##{iteration}"
    iteration += 1

    block_of_customers = get_coupons_chunk(coupon_api, offset, limit)
    coupons.concat(block_of_customers)

    offset += limit
    need_more_records = block_of_customers.length == limit
    # sleep(1)  # I'm testing rate limiter headers.  this should probably be uncommented.  maybe.
  end

  puts coupons.inspect

rescue UltracartClient::ApiError => e
  puts "API Exception when calling CouponApi->get_coupons: #{e.message}"
  puts e.response_body.inspect
rescue StandardError => e
  puts "Exception when calling CouponApi->get_coupons: #{e.message}"
end