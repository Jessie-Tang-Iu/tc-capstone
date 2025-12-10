// app/api/invoice/route.js

import { getInvoicesByAdvisorIdController, getInvoiceByIdController, updateInvoiceController } from "@/backend/controllers/invoicesController";
import { NextResponse } from "next/server";


export async function PUT(request) {
  console.log("API route hit: /api/invoice");

  try {
    const body = await request.json();
    console.log("Request body:", body);
    if (!body.advisorId) {
      return NextResponse.json({ error: "Missing advisorId" }, { status: 400 });
    }
    const invoices = await getInvoicesByAdvisorIdController(body.advisorId);
    return NextResponse.json(invoices);
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