using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class AdjustOrderTotal
    {
        // uncomment to run.  C# projects can only have one main.
        // public static void Main()
        // {
        //     var result = AdjustOrderTotalCall();
        //     Console.WriteLine($"Result of OrderAPI.AdjustOrderTotal was {result}");
        // }

        // Comments about AdjustOrderTotal
        public static bool AdjustOrderTotalCall()
        {
            const string simpleKey = "109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00";
            var api = new OrderApi(simpleKey);

            // this order's original subtotal was around $314.93 and a quantity of 7 items.
            // We'll reduce the price by a multiplier of one item, although that is not a requirement.
            // The new total must be less than the current and greater than zero.
            // If the result is false, the order was still updated, but the target was not achieved.
            // This will happen if the algorithm reaches the maximum iteration and is still a few pennies off.
            var orderId = "DEMO-0009104402";
            var newTotal = "217.93"; // notice this is a string

            BaseResponse result = api.AdjustOrderTotal(orderId, newTotal);
            return result.Success && result.Success;
        }
    }
}