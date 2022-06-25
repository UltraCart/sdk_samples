import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.Coupon;
import com.ultracart.admin.v2.models.CouponResponse;
import com.ultracart.admin.v2.util.ApiException;

public class GetCustomer {

    public static void main(String[] args) throws ApiException {

        final String apiKey = "109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00";
        CouponApi couponApi = new CouponApi(apiKey);
        CouponResponse response = couponApi.getCouponByMerchantCode("10OFF", "");
        Coupon coupon = response.getCoupon();
        System.out.println(coupon);

    }

}
