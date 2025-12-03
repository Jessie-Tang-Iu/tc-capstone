"use client";


import AdvisorNavbar from "@/app/components/AdvisorNavBar";
import Button from "@/app/components/ui/Button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";



export default function InvoiceDetail({ params }) {

    const [window, setWindow] = useState("viewInvoice");
    const [date, setDate] = useState("2024-07-15");
    const [clientName, setClientName] = useState("John Doe");
    const [phone, setPhone] = useState("825-912-2324");
    const [email, setEmail] = useState("john.d@gmail.com");
    const [quantity, setQuantity] = useState(1);
    const [unitePrice, setUnitPrice] = useState(150.00);
    const [tax, setTax] = useState(7.50);
    const [total, setTotal] = useState(157.50);
    const [status, setStatus] = useState("Paid");

    const { id } = useParams();

    const router = useRouter();

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
                            <button onClick={() => router.push("/advisorDashboard")} className="text-[20px] text-black font-semibold mb-5 hover:underline">
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
                                                <p className="text-black mb-2"><strong>Date Issued:</strong> {date}</p>
                                                <p className="text-black mb-2"><strong>Client Name:</strong> {clientName}</p>
                                                <p className="text-black mb-2"><strong>Phone:</strong> {phone}</p>
                                                <p className="text-black mb-2"><strong>Email:</strong> {email}</p>
                                            </div>
                                            
                                            <div>
                                                <Button text="Edit" onClick={() => setWindow("editInvoice")}/>
                                            </div>
                                        </div>
                                        

                                        <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Description</h2>
                                        <p className="text-black mb-2"><strong>Service:</strong> Advisory Session</p>
                                        <p className="text-black mb-2"><strong>Quantity:</strong> {quantity}</p>
                                        <p className="text-black mb-10"><strong>Unit Price:</strong> ${unitePrice}</p>

                                        <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Total</h2>
                                        <p className="text-black mb-2"><strong>Tax:</strong> ${tax}</p>
                                        <p className="text-black mb-2"><strong>Total:</strong> ${total}</p>
                                        <p className="text-black mb-2"><strong>Status:</strong> {status}</p>

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
                                                        value={date}
                                                        onChange={(e) => setDate(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex flex-row mb-2 items-center">
                                                    <p className="text-black mr-2"><strong>Client Name:</strong></p>
                                                    <input type="text" 
                                                        className="border border-gray-300 rounded-md p-2 text-black"
                                                        value={clientName}
                                                        onChange={(e) => setClientName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex flex-row mb-2 items-center">
                                                    <p className="text-black mr-2"><strong>Phone:</strong></p>
                                                    <input type="text" 
                                                        className="border border-gray-300 rounded-md p-2 text-black"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex flex-row mb-2 items-center">
                                                    <p className="text-black mr-2"><strong>Email:</strong></p>
                                                    <input type="email" 
                                                        className="border border-gray-300 rounded-md p-2 text-black"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
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
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="flex flex-row mb-10 items-center">
                                            <p className="text-black mr-2"><strong>Unit Price:</strong></p>
                                            <input type="number" 
                                                className="border border-gray-300 rounded-md p-2 text-black ml-2 w-20"
                                                value={unitePrice}
                                                onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
                                            />
                                        </div>

                                        <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Total</h2>
                                        <div className="flex flex-row mb-2 items-center">
                                            <p className="text-black mr-2"><strong>Tax:</strong></p>
                                            <input type="number" 
                                                className="border border-gray-300 rounded-md p-2 text-black ml-2 w-20"
                                                value={tax}
                                                onChange={(e) => setTax(parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="flex flex-row mb-2 items-center">
                                            <p className="text-black mr-2"><strong>Total:</strong></p>
                                            <input type="number"
                                                className="border border-gray-300 rounded-md p-2 text-black ml-2 w-20"
                                                value={total}
                                                onChange={(e) => setTotal(parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="flex flex-row mb-2 items-center">
                                            <p className="text-black mr-2"><strong>Status:</strong></p>
                                            <select
                                                className="border border-gray-300 rounded-md p-2 text-black"
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                            >
                                                <option value="Paid">Paid</option>
                                                <option value="Unpaid">Unpaid</option>
                                                <option value="Overdue">Overdue</option>
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