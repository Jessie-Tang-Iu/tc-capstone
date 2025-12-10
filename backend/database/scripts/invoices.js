import { query } from "../../database/db.js";

// Get all invoices by advisoryId
export async function getInvoicesByAdvisorId(id) {
  const result = await query(`SELECT i.* , (a.first_name || ' ' || a.last_name) AS "advisor_name", (c.first_name || ' ' || c.last_name) AS "client_name", c.email AS "client_email", c.phone AS "client_phone"
                                FROM invoices i
                                LEFT OUTER JOIN users a
                                ON i.advisor_id = a.clerk_id
                                LEFT OUTER JOIN users c
                                ON i.client_id = c.clerk_id
                                WHERE advisor_id = $1;`, 
    [id]
  );
  // if (!result.rows.length) throw new Error("Not found");
  return result.rows || [];
}


// Get the invoice by invoiceId
export async function getInvoiceById(id) {
  const result = await query(`SELECT i.* , (a.first_name || ' ' || a.last_name) AS "advisor_name", (c.first_name || ' ' || c.last_name) AS "client_name", c.email AS "client_email", c.phone AS "client_phone"
                                FROM invoices i
                                LEFT OUTER JOIN users a
                                ON i.advisor_id = a.clerk_id
                                LEFT OUTER JOIN users c
                                ON i.client_id = c.clerk_id
                                WHERE invoice_id = $1`, [
    Number(id),
  ]);
  if (!result.rows.length) throw new Error("Not found");
  return result.rows[0];
}