require 'ultracart_api'
require_relative '../constants'

# uploadCouponCodes allows a merchant to upload one-time use codes and associate them with a merchant code (i.e. a coupon).
# UltraCart has methods for generating one-time codes, and they work well, but this method exists when the merchant generates
# them themselves.  This frequently occurs when a merchant sends out a mailer with unique coupon codes on the mailer.  The
# merchant can then upload those codes with this method.

# Initialize the coupon API
coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)
coupon_oid = 12345678  # if you don't know your coupon_oid, use generateOneTimeCodesByMerchantCode.  same results

codes_request = UltracartClient::UploadCouponCodesRequest.new
codes_request.coupon_codes = ['code1', 'code2', 'code3']

api_response = coupon_api.upload_coupon_codes(coupon_oid, codes_request)
puts 'Uploaded codes:'
puts api_response.uploaded_codes
puts 'Duplicated codes:'
puts api_response.duplicate_codes
puts 'Rejected codes:'
puts api_response.rejected_codes