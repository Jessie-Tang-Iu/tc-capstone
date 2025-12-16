// app/api/invoice/send/route.js

import { NextResponse } from 'next/server';
// ⚠️ IMPORTANT: You must install and configure an ESP library (e.g., Resend, Nodemailer, SendGrid)
// For this example, we assume you have a function named 'sendInvoiceEmail'
// that talks to your chosen ESP.
import { sendInvoiceEmail } from '@/backend/services/emailService'; 
import { getInvoiceDetails } from '@/backend/controllers/invoicesController'; // Utility to fetch full invoice data

export async function POST(req) {
    try {
        const body = await req.json();
        const { invoiceId, 
            clientEmail, 
            advisorName, 
            client_name,
            totalAmount,
            issued_date,
            dueDate,
            clientPhone,
            quantity,
            unit_price,
            tax,
            status,
         } = body;

        if (!invoiceId || !clientEmail) {
            return NextResponse.json({ error: "Missing invoice ID or client email." }, { status: 400 });
        }
        
        // Optional: Fetch the full invoice details again on the server 
        // to ensure data integrity before sending.
        // const invoiceDetails = await getInvoiceDetails(invoiceId);

        // Call the service function to send the email
        await sendInvoiceEmail({
            to: clientEmail,
            subject: `Invoice #${invoiceId} from ${body.advisorName}`,
            // Pass necessary data for the email template
            invoiceData: body 
        });

        return NextResponse.json({ message: "Email queued successfully" }, { status: 200 });

    } catch (error) {
        console.error("POST /api/invoice/send failed:", error);
        return NextResponse.json({ error: "Internal error during email sending." }, { status: 500 });
    }
}