require_relative '../constants'
require 'ultracart_api'

=begin
retrieves coupons by query.  Can filter on specific coupons or return back all coupons.  Support pagination.
A note about the coupon type below.  Those are string literals representing coupons.  This method is used UltraCart's
backend, and it uses a dropdown box for that value showing friendly descriptions of them.

It's not anticipated a merchant would need to query by coupon type, but in the event you do, here's the list of constants:
"BOGO limit L"
"Free shipping method Y"
"Free shipping method Y with purchase of items Z"
"Free shipping method Y with subtotal Z"
"Free shipping on item Z"
"Free X with purchase of Y dollars limit L"
"Free X with purchase of Y dollars limit L and shipping Z"
"Free X with purchase of Y limit L"
"Free X with purchase of Y limit L and free shipping"
"I Free X with every J purchase of Y limit L"
"I Free X with every J purchase of Y mix and match group limit L"
"Item X for Y with purchase of Z limit L"
"multiple X $ off item Z limit L"
"No discount"
"Tiered Dollar Off Subtotal"
"Tiered % off items Z limit L"
"Tiered $ off item Z limit L"
"Tiered Percent off shipping methods Y with subtotal Z"
"Tiered Percent Off Subtotal"
"X dollars off shipping method Y with purchase of items Z"
"X dollars off subtotal with purchase Y items"
"X $ for item Z limit L"
"X more loyalty cashback"
"X more loyalty points"
"X % off item Z and free shipping"
"X $ off item Z limit L"
"X % off item Z limit L"
"X % off msrp item Z limit L"
"X % off retail item Z limit L"
"X $ off shipping method Y"
"X % off shipping method Y"
"X $ off subtotal"
"X % off subtotal"
"X $ off subtotal and shipping"
"X % off subtotal free shipping method Y"
"X % off subtotal limit L"
"X off subtotal with purchase block of L item Y"
"X % off subtotal with purchase of item Y"
"X % off subtotal with purchase of Y"
"X $ off subtotal with Y $ purchase"
"X $ off subtotal with Y $ purchase and free shipping"
"X % off Y with purchase Z limit L"
"X % off Y with T purchase Z limit L"
"X percent more loyalty points"
"X $ shipping method Y with subtotal Z"
"X ? subtotal"
=end

def get_coupon_chunk(coupon_api, offset, limit)
  query = UltracartClient::CouponQuery.new
  query.merchant_code = '10OFF'  # supports partial matching
  query.description = 'Saturday'  # supports partial matching
  # query.coupon_type = nil  # see the note at the top of this sample.
  # query.start_dts_begin = (Date.today - 2000).strftime('%Y-%m-%d') + 'T00:00:00+00:00'  # yes, that 2,000 days.
  # query.start_dts_end = Date.today.strftime('%Y-%m-%d') + 'T00:00:00+00:00'
  # query.expiration_dts_begin = nil
  # query.expiration_dts_end = nil
  # query.affiliate_oid = 0  # this requires an affiliate_oid.  If you need help finding an affiliate's oid, contact support.
  query.exclude_expired = true

  # coupons do not have expansions
  # Possible sorts: "coupon_type", "merchant_code", "description", "start_dts", "expiration_dts", "quickbooks_code"
  opts = {
    _expand: nil,
    _sort: 'merchant_code'
  }

  api_response = coupon_api.get_coupons_by_query(query, limit, offset, opts)
  return api_response.coupons if api_response.coupons
  []
end

coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
coupons = []

iteration = 1
offset = 0
limit = 200
more_records_to_fetch = true

while more_records_to_fetch
  puts "executing iteration #{iteration}"
  chunk_of_coupons = get_coupon_chunk(coupon_api, offset, limit)
  coupons.concat(chunk_of_coupons)
  offset += limit
  more_records_to_fetch = chunk_of_coupons.length == limit
  iteration += 1
end

puts coupons.inspect