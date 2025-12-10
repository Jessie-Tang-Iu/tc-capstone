"use client";


import AdvisorNavbar from "@/app/components/AdvisorNavBar";
import Button from "@/app/components/ui/Button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function InvoiceDetail({ params }) {

    const [invoice, setInvoice] = useState({});
    const [window, setWindow] = useState("viewInvoice");

    const { id } = useParams();

    const router = useRouter();

    useEffect(() => {
        // Fetch invoice details from backend API using id
        (async () => {
            console.log("Fetching invoice details for ID:", id);
            try {
                const res = await fetch(`/api/invoice`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ invoice_id: id }),
                });
                if (!res.ok) {
                    console.error("Failed to fetch invoices");
                    return;
                }
                const data = await res.json();
                console.log("Fetched invoice:", data);
                setInvoice(data);
            } catch (error) {
                console.error("Fetch error: ", error);
            }
        })();
    }, [id]);

    useEffect(() => {
        // Recalculate tax and amount when quantity or unit price changes
        const newSubtotal = parseFloat((invoice.quantity * invoice.unit_price).toFixed(2));
        const newTax = parseFloat((newSubtotal * 0.05).toFixed(2));
        const newAmount = parseFloat((newSubtotal + newTax).toFixed(2));
        setInvoice(prevInvoice => ({
            ...prevInvoice,
            tax: newTax,
            amount: newAmount
        }));
    }, [invoice.quantity, invoice.unit_price]);

    console.log("Invoice Detail State:", invoice);

    const sendToClient = () => {
        console.log("Send to client clicked for invoice:", id, "\nAmount: $157.50");
        alert(`Invoice ${id} sent to client!`);
    }

    return (
        <main className="w-full min-h-screen bg-linear-to-br from-[#f8eae2] to-white">
                    <AdvisorNavbar />
                
                    <div className="mx-auto w-full max-w-8xl px-6 py-8">
                        {/* <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
                            Advisor DashBoard
                        </h1> */}

                        <div className="flex justify-between mb-5">
                            <button onClick={() => router.push("/advisorDashboard")} className="text-[20px] text-black font-semibold hover:underline">
                                &lt; Back to Invoices
                            </button>

                            {window === "viewInvoice" &&
                                <div>
                                    <Button text="Send To Client" onClick={sendToClient}/>
                                </div>
                            }
                            
                            
                        </div>

                        <div className="flex justify-center items-center flex-col bg-white p-6 rounded-lg shadow-md mb-10">
                            <div className="mb-4 text-4xl font-semibold text-[#E55B3C]">
                                Invoice Information
                            </div>
                            <p className="text-black mb-2"><strong>Invoice ID:</strong> {invoice.invoice_id}</p>
                            <p className="text-black mb-2"><strong>Advisor:</strong> {invoice.advisor_name}</p>
                        </div>

                        <div className="flex flex-col bg-white p-6 rounded-lg shadow-md">

                            {window === "viewInvoice" && 
                                (
                                    <div>

                                        <div className="mb-10 flex justify-between">
                                            <div>
                                                <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Bill To</h2>
                                                <p className="text-black mb-2"><strong>Date Issued:</strong> {invoice.issued_date?.split("T")[0]}</p>
                                                <p className="text-black mb-2"><strong>Due Date:</strong> {invoice.due_date?.split("T")[0]}</p>
                                                <p className="text-black mb-2"><strong>Client Name:</strong> {invoice.client_name}</p>
                                                <p className="text-black mb-2"><strong>Phone:</strong> {invoice.client_phone}</p>
                                                <p className="text-black mb-2"><strong>Email:</strong> {invoice.client_email}</p>
                                            </div>
                                            
                                            <div>
                                                <Button text="Edit" onClick={() => setWindow("editInvoice")}/>
                                            </div>
                                        </div>
                                        

                                        <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Description</h2>
                                        <p className="text-black mb-2"><strong>Service:</strong> Advisory Session</p>
                                        <p className="text-black mb-2"><strong>Quantity:</strong> {invoice.quantity}</p>
                                        <p className="text-black mb-10"><strong>Unit Price:</strong> ${invoice.unit_price}</p>

                                        <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Total</h2>
                                        <p className="text-black mb-2"><strong>Tax:</strong> ${invoice.tax}</p>
                                        <p className="text-black mb-2"><strong>Total:</strong> ${invoice.amount}</p>
                                        <p className="text-black mb-2"><strong>Status:</strong> {invoice.status}</p>

                                    </div>
                            )}

                            {window === "editInvoice" &&
                                (
                                    <div>
                                        <div className="mb-10 flex justify-between">
                                            <div>
                                                <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Bill To</h2>
                                                <div className="flex flex-row mb-2 items-center">
                                                    <p className="text-black mr-2"><strong>Date Issued:</strong></p>
                                                    <input type="date" 
                                                        className="border border-gray-300 rounded-md p-2 text-black"
                                                        value={invoice.issued_date?.split("T")[0]}
                                                        onChange={(e) => setInvoice(prevInvoice => ({
                                                            ...prevInvoice,
                                                            issued_date: e.target.value
                                                        }))}
                                                    />
                                                </div>
                                                <div className="flex flex-row mb-2 items-center">
                                                    <p className="text-black mr-2"><strong>Date Issued:</strong></p>
                                                    <input type="date" 
                                                        className="border border-gray-300 rounded-md p-2 text-black"
                                                        value={invoice.due_date?.split("T")[0]}
                                                        onChange={(e) => setInvoice(prevInvoice => ({
                                                            ...prevInvoice,
                                                            due_date: e.target.value
                                                        }))}
                                                    />
                                                </div>
                                                    <p className="text-black mb-2"><strong>Client Name:</strong> {invoice.client_name}</p>
                                                    <p className="text-black mb-2"><strong>Phone:</strong> {invoice.client_phone}</p>
                                                    <p className="text-black mb-2"><strong>Email:</strong> {invoice.client_email}</p>
                                            </div>
                                            <div>
                                                <Button text="Back to View" onClick={() => setWindow("viewInvoice")}/>
                                            </div>
                                        </div>

                                        <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Description</h2>
                                        <p className="text-black mb-2"><strong>Service:</strong> Advisory Session</p>
                                        <div className="flex flex-row mb-2 items-center">
                                            <p className="text-black mr-2"><strong>Quantity:</strong></p>
                                            <input type="number" 
                                                className="border border-gray-300 rounded-md p-2 text-black ml-2 w-20"
                                                value={invoice.quantity}
                                                onChange={(e) => setInvoice(prevInvoice => ({
                                                            ...prevInvoice,
                                                            quantity: parseInt(e.target.value)
                                                        }))}
                                            />
                                        </div>
                                        <div className="flex flex-row mb-10 items-center">
                                            <p className="text-black mr-2"><strong>Unit Price:</strong></p>
                                            <input type="number" 
                                                className="border border-gray-300 rounded-md p-2 text-black ml-2 w-20"
                                                value={invoice.unit_price}
                                                onChange={(e) => setInvoice(prevInvoice => ({
                                                            ...prevInvoice,
                                                            unit_price: parseFloat(e.target.value)
                                                        }))}
                                            />
                                        </div>

                                        <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Total</h2>
                                        <div className="flex flex-row mb-2 items-center">
                                            <p className="text-black mr-2"><strong>Tax:</strong></p>
                                            <input type="number" 
                                                className="border border-gray-300 rounded-md p-2 text-black ml-2 w-20"
                                                value={invoice.tax}
                                                onChange={(e) => setInvoice(prevInvoice => ({
                                                            ...prevInvoice,
                                                            tax: parseFloat(e.target.value)
                                                        }))}
                                            />
                                        </div>
                                        <div className="flex flex-row mb-2 items-center">
                                            <p className="text-black mr-2"><strong>Total:</strong></p>
                                            <input type="number"
                                                className="border border-gray-300 rounded-md p-2 text-black ml-2 w-20"
                                                value={invoice.amount}
                                                onChange={(e) => setInvoice(prevInvoice => ({
                                                            ...prevInvoice,
                                                            amount: parseFloat(e.target.value)
                                                        }))}
                                            />
                                        </div>
                                        <div className="flex flex-row mb-2 items-center">
                                            <p className="text-black mr-2"><strong>Status:</strong></p>
                                            <select
                                                className="border border-gray-300 rounded-md p-2 text-black"
                                                value={invoice.status}
                                                onChange={(e) => setInvoice(prevInvoice => ({
                                                            ...prevInvoice,
                                                            status: e.target.value
                                                        }))}
                                            >
                                                <option value="paid">paid</option>
                                                <option value="unpaid">unpaid</option>
                                                <option value="overdue">overdue</option>
                                            </select>
                                        </div>
                                    </div>
                                )
                            }

                            
                        </div>
                        
                    </div>
        </main>
    );
}