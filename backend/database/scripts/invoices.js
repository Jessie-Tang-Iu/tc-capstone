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


// Update an invoice by invoiceId
export async function updateInvoiceById(body) {
    const { invoice_id, quantity, unit_price, tax, amount, issued_date, due_date, status } = body;
    const result = await query(
        `UPDATE invoices 
        SET quantity = $1, unit_price = $2, tax = $3, amount = $4, issued_date = $5, due_date = $6, status = $7
        WHERE invoice_id = $8
        RETURNING *;`,
        [quantity, unit_price, tax, amount, issued_date, due_date, status, invoice_id]
    );
    if (!result.rows.length) throw new Error("Not found");
    return result.rows[0];
}


// Create a new invoice
export async function createInvoice(body) {
    const { advisor_id, client_id } = body;
    const result = await query(
        `INSERT INTO invoices (advisor_id, client_id, quantity, unit_price, tax, amount, issued_date, due_date, status)
        VALUES ($1, $2, 0, 0.0, 0.0, 0.0, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'unpaid')
        RETURNING *;`,
        [advisor_id, client_id]
    );
    return result.rows[0];
}
    