"use client";


import AdvisorNavbar from "@/app/components/AdvisorNavBar";
import Button from "@/app/components/ui/Button";
import { useParams } from "next/navigation";
import { useState } from "react";



export default function InvoiceDetail({ params }) {

    const [window, setWindow] = useState("viewInvoice");
    const { id } = useParams();

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

                        <div className="flex justify-between">
                            <button onClick={() => window.history.back()} className="text-[20px] text-black font-semibold mb-5 hover:underline">
                                &lt; Back to Invoices
                            </button>
                            <div>
                                <Button text="Send To Client" onClick={sendToClient}/>
                            </div>
                            
                        </div>

                        <div className="flex justify-center items-center flex-col bg-white p-6 rounded-lg shadow-md mb-10">
                            <div className="mb-4 text-4xl font-semibold text-[#E55B3C]">
                                Invoice Information
                            </div>
                            <p className="text-black mb-2"><strong>Invoice ID:</strong> {id}</p>
                            <p className="text-black mb-2"><strong>Advisor:</strong> Advisor Name</p>
                        </div>

                        <div className="flex flex-col bg-white p-6 rounded-lg shadow-md">

                            {window === "viewInvoice" && 
                                (
                                    <div>

                                    <div className="mb-10 flex justify-between">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Bill To</h2>
                                            <p className="text-black mb-2"><strong>Date Issued:</strong> June 15, 2024</p>
                                            <p className="text-black mb-2"><strong>Client Name:</strong> John Doe</p>
                                            <p className="text-black mb-2"><strong>Phone:</strong> 825-912-2324</p>
                                            <p className="text-black mb-2"><strong>Email:</strong> john.d@gmail.com</p>
                                        </div>
                                        
                                        <div>
                                            <Button text="Edit" onClick={() => setWindow("editInvoice")}/>
                                        </div>
                                    </div>
                                    

                                    <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Description</h2>
                                    <p className="text-black mb-2"><strong>Service:</strong> Advisory Session</p>
                                    <p className="text-black mb-2"><strong>Quantity:</strong> 1</p>
                                    <p className="text-black mb-10"><strong>Unit Price:</strong> $150.00</p>

                                    <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Total</h2>
                                    <p className="text-black mb-2"><strong>Tax:</strong> $7.50</p>
                                    <p className="text-black mb-2"><strong>Total:</strong> $157.50</p>
                                    <p className="text-black mb-2"><strong>Status:</strong> Paid</p>

                                    </div>
                            )}

                            {
                                window === "editInvoice" &&
                                (
                                    <div>
                                        <div>
                                            <Button text="Back to View" onClick={() => setWindow("viewInvoice")}/>
                                        </div>
                                    </div>
                                )
                            }

                            
                        </div>
                        
                    </div>
        </main>
    );
}