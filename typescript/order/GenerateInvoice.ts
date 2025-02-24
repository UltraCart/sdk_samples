import {orderApi} from '../api';
import {OrderInvoiceResponse} from 'ultracart_rest_api_v2_typescript';
import * as fs from 'fs/promises';

export class GenerateInvoice {
    /**
     * generateInvoice returns back a base64 encoded byte array of the given order's Invoice in PDF format.
     */
    public static async execute(): Promise<void> {
        const orderId = 'DEMO-0009104976';

        try {
            // Await the API call
            const apiResponse: OrderInvoiceResponse = await orderApi.generateInvoice({orderId});

            // the invoice will return as a base64 encoded
            // unpack, save off, email, whatever.
            const base64PdfOrUndefined = apiResponse.pdfBase64;
            if (base64PdfOrUndefined !== undefined) {
                const base64Pdf = base64PdfOrUndefined as string;
                // Decode base64 to buffer
                const decodedPdf = Buffer.from(base64Pdf, 'base64');

                // Write PDF to file
                await fs.writeFile('invoice.pdf', decodedPdf);

                // If this is running as a web application, you could return the PDF to the browser
                // using something like this (this is Express.js-specific code):
                /*
                app.get('/invoice', async (req, res) => {
                    res.contentType('application/pdf');
                    res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');
                    res.setHeader('Cache-Control', 'public, must-revalidate, max-age=0');
                    res.setHeader('Pragma', 'public');
                    res.send(decodedPdf);
                });
                */

                console.log('Invoice PDF saved to invoice.pdf');
            }
        } catch (error) {
            console.error('Error generating invoice:', error);
        }
    }
}

// Optional: If you want to call the method
// GenerateInvoice.execute();