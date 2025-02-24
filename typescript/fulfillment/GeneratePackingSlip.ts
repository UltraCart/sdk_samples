import {
    OrderPackingSlipResponse
} from 'ultracart_rest_api_v2_typescript';
import {fulfillmentApi} from '../api';
import * as fs from 'fs';

export class GeneratePackingSlip {
    /**
     * generatePackingSlip accepts a distribution center code and order_id and returns back a base64 encoded byte array pdf.
     * Both the dc code and order_id are needed because an order may have multiple items shipping via different DCs.
     *
     * You will need the distribution center (DC) code. UltraCart allows for multiple DC and the code is a
     * unique short string you assign to a DC as an easy mnemonic.
     *
     * For more information about UltraCart distribution centers, please see:
     * https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
     *
     * If you do not know your DC code, query a list of all DC and print them out.
     * $result = $fulfillment_api->getDistributionCenters();
     * print_r($result);
     */
    public static async Execute(): Promise<void> {
        const distributionCenterCode: string = "RAMI";
        const orderId: string = "DEMO-12345";

        try {
            // limit is 500 inventory updates at a time. batch them if you're going large.
            const apiResponse: OrderPackingSlipResponse = await fulfillmentApi.generatePackingSlip({
                distributionCenterCode: distributionCenterCode,
                orderId: orderId
            });

            // Decode base64 PDF
            const base64Pdf: string = apiResponse.pdfBase64 || '';
            const decodedPdf: Buffer = Buffer.from(base64Pdf, 'base64');

            // Write PDF to file
            fs.writeFileSync('packing_slip.pdf', decodedPdf);

            console.log("done");
        } catch (e) {
            console.error("An unexpected error occurred:", e);
            process.exit(1);
        }
    }
}