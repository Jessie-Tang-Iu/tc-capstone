// backend/services/emailService.js (Placeholder file structure)

// Example integration with an imaginary ESP library
// NOTE: You must replace this with actual service code.
// export async function sendInvoiceEmail({ to, subject, invoiceData }) {
//     console.log(`Email Service: Attempting to send email to ${to}`);
    
//     // ⚠️ REAL CODE REQUIRES:
//     // 1. Your ESP configuration (API Key stored in environment variables)
//     // 2. HTML/text content for the email body (the invoice itself)
         
//     // Example using a fictional ESP SDK:
//     await Resend.emails.send({
//       from: 'techconnect.capstone.project@gmail.com',
//       to: to,
//       subject: subject,
//       html: `<h1>Your Invoice #${invoiceData.invoiceId} is due.</h1><p>Total: $${invoiceData.totalAmount}</p>`,
//     });
    
//     // Simulating success
//     console.log(`Email sent successfully to ${to}.`);
// }

// backend/services/emailService.js

// 1. Import the Resend class (assuming you have 'resend' installed: npm install resend)
import { Resend } from 'resend'; 
import 'dotenv/config'; // Make sure environment variables are loaded if necessary

// 2. Initialize Resend using the API key from environment variables
// Ensure RESEND_API_KEY is correctly set in your .env.local file.
const resend = new Resend(process.env.RESEND_API_KEY); 

// Create a new invoice
export async function sendInvoiceEmail({ to, subject, invoiceData }) {
    console.log(`Email Service: Attempting to send email to ${to} (techconnect.capstone.project@gmail.com)`);

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice [INVOICE_ID]</title>
        </head>

        <body style="margin: 30px; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff">
            <h1>Your Invoice [INVOICE_ID] is due.</h1>
            <p>Dear Client,</p>
            <p>Your invoice from Advisor [ADVISOR_NAME] is attached/detailed below.</p>
            <p>Thank you for your business.</p>
        </body>

        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8eae2;">

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8eae2;">
                <tr>
                    <td align="center" style="padding: 40px 0;">

                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td style="padding: 24px;">

                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px; text-align: center;">
                                        <tr>
                                            <td>
                                                <div style="font-size: 32px; font-weight: 600; color: #E55B3C; margin-bottom: 8px;">
                                                    Invoice Information
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p style="color: #000000; margin: 0 0 4px 0;">
                                                    <strong>Invoice ID:</strong> [INVOICE_ID]
                                                </p>
                                                <p style="color: #000000; margin: 0;">
                                                    <strong>Advisor:</strong> [ADVISOR_NAME]
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
                                        <tr>
                                            <td>
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px;">
                                                    <tr>
                                                        <td width="70%" valign="top">
                                                            <h2 style="font-size: 20px; font-weight: 600; color: #E55B3C; margin: 0 0 16px 0;">
                                                                Bill To
                                                            </h2>
                                                            <p style="color: #000000; margin: 0 0 4px 0;">
                                                                <strong>Date Issued:</strong> [ISSUED_DATE]
                                                            </p>
                                                            <p style="color: #000000; margin: 0 0 4px 0;">
                                                                <strong>Due Date:</strong> [DUE_DATE]
                                                            </p>
                                                            <p style="color: #000000; margin: 0 0 4px 0;">
                                                                <strong>Client Name:</strong> [CLIENT_NAME]
                                                            </p>
                                                            <p style="color: #000000; margin: 0 0 4px 0;">
                                                                <strong>Phone:</strong> [CLIENT_PHONE]
                                                            </p>
                                                            <p style="color: #000000; margin: 0;">
                                                                <strong>Email:</strong> [CLIENT_EMAIL]
                                                            </p>
                                                        </td>

                                                    </tr>
                                                </table>

                                                <h2 style="font-size: 20px; font-weight: 600; color: #E55B3C; margin: 0 0 16px 0;">
                                                    Description
                                                </h2>
                                                <p style="color: #000000; margin: 0 0 4px 0;">
                                                    <strong>Service:</strong> Advisory Session
                                                </p>
                                                <p style="color: #000000; margin: 0 0 4px 0;">
                                                    <strong>Quantity:</strong> [QUANTITY]
                                                </p>
                                                <p style="color: #000000; margin: 0 0 40px 0;">
                                                    <strong>Unit Price:</strong> $[UNIT_PRICE]
                                                </p>

                                                <h2 style="font-size: 20px; font-weight: 600; color: #E55B3C; margin: 0 0 16px 0;">
                                                    Total
                                                </h2>
                                                <p style="color: #000000; margin: 0 0 4px 0;">
                                                    <strong>Tax:</strong> $[TAX]
                                                </p>
                                                <p style="color: #000000; margin: 0 0 4px 0;">
                                                    <strong>Total:</strong> 
                                                    <span style="font-size: 16px; font-weight: bold;">$[AMOUNT]</span>
                                                </p>
                                                <p style="color: #000000; margin: 0;">
                                                    <strong>Status:</strong> [STATUS]
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        `;

    // Replace placeholders with actual data
    const finalHtml = htmlContent
        .replace(/\[INVOICE_ID\]/g, invoiceData.invoiceId)
        .replace(/\[ADVISOR_NAME\]/g, invoiceData.advisorName)
        .replace(/\[ISSUED_DATE\]/g, invoiceData.issued_date.split('T')[0])
        .replace(/\[DUE_DATE\]/g, invoiceData.dueDate.split('T')[0])
        .replace(/\[CLIENT_NAME\]/g, invoiceData.client_name)
        .replace(/\[CLIENT_PHONE\]/g, invoiceData.clientPhone || '')
        .replace(/\[CLIENT_EMAIL\]/g, invoiceData.clientEmail)
        .replace(/\[QUANTITY\]/g, invoiceData.quantity)
        .replace(/\[UNIT_PRICE\]/g, invoiceData.unit_price)
        .replace(/\[TAX\]/g, invoiceData.tax)
        .replace(/\[AMOUNT\]/g, invoiceData.totalAmount)
        .replace(/\[STATUS\]/g, invoiceData.status)

    try {
        // 3. Use the initialized instance 'resend' (lowercase)
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'techconnect.capstone.project@gmail.com',
            subject: subject,
            html: finalHtml,
        });

        // ✅ FIX: Safely check if the response data and ID exist before logging
        if (response && response.data && response.data.id) {
            console.log(`Email sent successfully to ${to}. Resend ID: ${response.data.id}`);
        } else {
            // Log the full response if the expected structure is missing
            console.error("Resend succeeded but returned an unexpected response structure:", response);
            // Throw a custom error if we can't confirm success
            throw new Error("Resend API returned an invalid response.");
        }
        
    } catch (error) {
        // This catch block handles SDK errors (network, auth, validation)
        console.error("Resend SDK Error:", error);
        
        // If the error object has a specific message from Resend, use it.
        const errorMessage = error.message || "An unknown error occurred with the email service.";
        
        // Re-throw the error to be caught by the Next.js API route handler
        throw new Error(`Email sending failed: ${errorMessage}`);
    }
}