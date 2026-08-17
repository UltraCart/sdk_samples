import { orderApi } from '../api';
import {
    OrderPageViewHistoryResponse,
    OrderPageView
} from 'ultracart_rest_api_v2_typescript';

/**
 * getOrderPageViewHistory returns the page views captured during the session that placed an order,
 * along with the referrer that started that session.
 *
 * A customer profile is NOT required.  These page views are keyed off an analytics client id stored on
 * the order itself, so this works for guest orders.  For the email engagement side of customer activity,
 * use getOrderCustomerActivity instead.
 *
 * An order placed outside the storefront, such as a phone order or an order imported from a channel
 * partner, will have no analytics session attached.  In that case page_views comes back empty.  That is a
 * successful response rather than an error.
 *
 * Note: view_dts is an ISO 8601 string here.  Be aware that the ts field on getOrderCustomerActivity is
 * unix milliseconds instead, so do not assume the two methods format dates the same way.
 *
 * Possible Errors:
 * order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
 */
export async function execute(): Promise<void> {
    const orderId = "DEMO-0009104976";

    try {
        const response: OrderPageViewHistoryResponse = await orderApi.getOrderPageViewHistory({
            orderId: orderId
        });

        console.log(`Session referrer: ${response.referrer || '(none captured)'}`);

        const pageViews: OrderPageView[] = response.page_views || [];

        if (pageViews.length === 0) {
            console.log('No page views were captured for this order.');
            return;
        }

        for (const pageView of pageViews) {
            const timeOnPage = pageView.time_on_page ? ` (${pageView.time_on_page}s on page)` : '';
            console.log(`${pageView.view_dts} - ${pageView.url}${timeOnPage}`);

            for (const param of pageView.params || []) {
                console.log(`    param ${param.name} = ${param.value}`);
            }

            for (const meta of pageView.meta_data || []) {
                console.log(`    meta  ${meta.name} = ${meta.value}`);
            }
        }
    } catch (error) {
        console.error('Error fetching page view history:', error);
    }
}
