import {orderApi} from '../api.js';
import fs from 'fs/promises';

export class GenerateInvoice {
    /**
     * generateInvoice returns back a base64 encoded byte array of the given order's Invoice in PDF format.
     */
    static async execute() {
        const orderId = 'DEMO-0009104976';

        try {
            // Await the API call
            const apiResponse = await new Promise((resolve, reject) => {
                orderApi.generateInvoice(
                    orderId
                    , function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
            });

            // the invoice will return as a base64 encoded
            // unpack, save off, email, whatever.
            const base64PdfOrUndefined = apiResponse.pdfBase64;
            if (base64PdfOrUndefined !== undefined) {
                const base64Pdf = base64PdfOrUndefined;
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