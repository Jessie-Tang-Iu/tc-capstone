// app/api/invoice/route.js

import { getInvoicesByAdvisorIdController, getInvoiceByIdController, updateInvoiceController, createInvoiceController } from "@/backend/controllers/invoicesController";
import { NextResponse } from "next/server";


export async function GET(request) {
    console.log("API route hit: /api/invoice");

    // 1. Get the URL object to access search parameters
    const { searchParams } = new URL(request.url); 
    // 2. Extract the advisor_id value
    const advisorId = searchParams.get('advisor_id'); 
    // Log the ID for debugging
    console.log("Searching for invoices by Advisor ID:", advisorId);

    try {
        if (!advisorId) {
        return NextResponse.json({ error: "Missing advisorId" }, { status: 400 });
        }
        const invoices = await getInvoicesByAdvisorIdController(advisorId);
        return NextResponse.json(invoices, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/invoice:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    console.log("API route hit: /api/invoice");
    try {
        const body = await request.json();
        console.log("Request body:", body);
        if (!body.advisor_id) {
            return NextResponse.json({ error: "Missing advisorId" }, { status: 400 });
        }
        if (!body.client_id) {
            return NextResponse.json({ error: "Missing clientId" }, { status: 400 });
        }
        const invoices = await createInvoiceController(body);
        return NextResponse.json(invoices);
    } catch (error) {
        console.error("Error in PUT /api/invoice:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
  console.log("API route hit: /api/invoice");

  try {
    const body = await request.json();
    console.log("Request body:", body);
    if (!body.invoice_id) {
      return NextResponse.json({ error: "Missing invoice_id" }, { status: 400 });
    }
    const invoices = await getInvoiceByIdController(body.invoice_id);
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error in POST /api/invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
    console.log("API route hit: /api/invoice");
    try {
        const body = await request.json();
        console.log("Request body:", body);
        if (!body.invoice_id) {
            return NextResponse.json({ error: "Missing invoice_id" }, { status: 400 });
        }
        const invoices = await updateInvoiceController(body);
        return NextResponse.json(invoices);
    } catch (error) {
        console.error("Error in PATCH /api/invoice:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}