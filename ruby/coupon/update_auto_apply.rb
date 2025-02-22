require 'ultracart_api'
require_relative '../constants'

# updateAutoApply updates the items and subtotals conditions that trigger "auto coupons", i.e. coupons that are automatically
# added to a shopping cart.  The manual configuration of auto coupons is at the bottom of the main coupons screen.
# See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376525/Coupons#Coupons-Navigation

# Success is 200 (There is no content.  Yes, this should return a 204, but it returns a 200 with no content)

# Initialize the coupon API
coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)

auto_apply = UltracartClient::CouponAutoApplyConditions.new

item_condition = UltracartClient::CouponAutoApplyCondition.new
item_condition.required_item_id = 'ITEM_ABC'
item_condition.coupon_code = '10OFF'
item_conditions = [item_condition]

subtotal_condition = UltracartClient::CouponAutoApplyCondition.new
subtotal_condition.minimum_subtotal = 50 # must spend fifty dollars
item_condition.coupon_code = '5OFF'
subtotal_conditions = [subtotal_condition]

auto_apply.required_items = item_conditions
auto_apply.subtotal_levels = subtotal_conditions

coupon_api.update_auto_apply(auto_apply)