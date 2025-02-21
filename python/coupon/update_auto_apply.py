from ultracart.apis import CouponApi
from ultracart.models import CouponAutoApplyCondition, CouponAutoApplyConditions
from samples import api_client

coupon_api = CouponApi(api_client())

auto_apply = CouponAutoApplyConditions()

item_condition = CouponAutoApplyCondition()
item_condition.required_item_id = 'ITEM_ABC'
item_condition.coupon_code = '10OFF'
item_conditions = [item_condition]

subtotal_condition = CouponAutoApplyCondition()
subtotal_condition.minimum_subtotal = 50  # must spend fifty dollars
subtotal_condition.coupon_code = '5OFF'  # Fixed bug: was setting on item_condition in PHP
subtotal_conditions = [subtotal_condition]

auto_apply.required_items = item_conditions
auto_apply.subtotal_levels = subtotal_conditions

coupon_api.update_auto_apply(auto_apply)