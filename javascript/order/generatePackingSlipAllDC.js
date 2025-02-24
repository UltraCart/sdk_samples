import { orderApi } from '../api.js';
import fs from 'fs/promises';
import { Buffer } from 'buffer';

export class GeneratePackingSlipAllDC {
    /**
     * OrderApi.generatePackingSlipAllDC() is a method that might be used by a fulfillment center or distribution
     * center to generate a packing slip to include with a shipment.  This method will return a packing slip for
     * an order for all distribution centers involved.
     */
    static async execute() {
        const orderId = 'DEMO-0009104390';

        try {
            // Generate packing slip for all distribution centers
            const apiResponse = await new Promise((resolve, reject) => {
                orderApi.generatePackingSlipAllDC(
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
// GeneratePackingSlipAllDC.execute();