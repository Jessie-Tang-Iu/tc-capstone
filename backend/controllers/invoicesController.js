/*
 * This file controls the requests between the api routes in the frontend and the backend scripts.
 * This allows us to implement things like Auth checks in the future, also seperates our database from the frontend logic.
 * This also allows us to check data in a safe environment before sending it to the database, ESPECIALLY IMPORTANT if files are being uploaded.
 */

import * as invoices from "../database/scripts/invoices.js"; // Imports all scripts from the invoices.js file


// call this function to get all invoices by advisor id
export async function getInvoicesByAdvisorIdController(advisorId) {
  if (!advisorId) throw new Error("advisorId required");
  return await invoices.getInvoicesByAdvisorId(advisorId);
}

// call this function to get an invoice by invoice id
export async function getInvoiceByIdController(invoiceId) {
  if (!invoiceId) throw new Error("invoiceId required");
  return await invoices.getInvoiceById(invoiceId);
}