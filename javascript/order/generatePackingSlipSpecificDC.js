import { orderApi } from '../api.js';
import fs from 'fs/promises';
import { Buffer } from 'buffer';

export class GeneratePackingSlipSpecificDC {
    /**
     * OrderApi.generatePackingSlipSpecificDC() is a method that might be used by a fulfillment center or distribution
     * center to generate a packing slip to include with a shipment.  As such, this method allows for a packing slip
     * for a specific distribution center (DC) in the case that an order has multiple shipments from multiple DC.
     *
     * You must know the DC, which should not be a problem for any custom shipping application.
     * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
     */
    static async execute() {
        const orderId = 'DEMO-0009104390';
        const dc = 'DFLT';

        try {
            // Generate packing slip for a specific distribution center
            const apiResponse = await new Promise((resolve, reject) => {
                orderApi.generatePackingSlipSpecificDC(dc,
                    orderId
                , function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            // Check for errors
            if (apiResponse.error) {
                console.error('Developer Message:', apiResponse.error.developer_message);
                console.error('User Message:', apiResponse.error.user_message);
                throw new Error('Failed to generate packing slip');
            }

            // the packing slip will return as a base64 encoded
            // unpack, save off, email, whatever.
            const base64PackingSlipOrUndefined = apiResponse.pdfBase64;

            if (base64PackingSlipOrUndefined !== undefined) {
                const base64PackingSlip = base64PackingSlipOrUndefined;

                console.log(base64PackingSlip);

                // Decode Base64 string into a buffer
                const pdfBuffer = Buffer.from(base64PackingSlip, 'base64');

                // Save the buffer to a PDF file
                await fs.writeFile('packing_slip.pdf', pdfBuffer);

                console.log("PDF file saved successfully as 'packing_slip.pdf'");
            }
        } catch (error) {
            console.error('Error generating packing slip:', error);
            process.exit(1);
        }
    }
}

// Optional: If you want to call the method
// GeneratePackingSlipSpecificDC.execute();