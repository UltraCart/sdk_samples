import {GetCoupons} from "./coupon/GetCoupons";
// import {ResponseError} from "ultracart_rest_api_v2_typescript";

// Self-executing async function since we can't use await at the top level
(async () => {
    try {
        await GetCoupons.execute();
    } catch (error) {
        console.log(error);
        // const responseError = error as ResponseError;
        // const response = responseError.response as Response;
        //
        // // For JSON responses
        // const jsonData = await response.json();
        // console.error('Response Body:', JSON.stringify(jsonData, null, 2));
        //
        // // Access other Response properties
        // console.error('Status:', response.status);
        // console.error('Status Text:', response.statusText);
        // console.error('Response Type:', response.type);
        // console.error('URL:', response.url);
    }
})();