"use client";


import AdvisorNavbar from "@/app/components/AdvisorNavBar";
import { useParams } from "next/navigation";



export default function InvoiceDetail({ params }) {

    const { id } = useParams();

    return (
        <main className="w-full min-h-screen bg-gradient-to-br from-[#f8eae2] to-white">
                    <AdvisorNavbar />
                
                    <div className="mx-auto w-full max-w-8xl px-6 py-8">
                        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
                            Advisor DashBoard
                        </h1>

                        <div className="flex justify-center items-center flex-col bg-white p-6 rounded-lg shadow-md mb-10">
                            <div className="mb-4 text-4xl font-semibold text-[#E55B3C]">
                                Invoice
                            </div>
                            <p className="text-black">Details for Invoice ID: {id}</p>
                        </div>

                        <div className="flex flex-col bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold text-[#E55B3C] mb-4">Invoice Information</h2>
                            <div className="flex flex-row space-x-20">
                                <p className="text-black mb-2"><strong>Invoice ID:</strong> {id}</p>
                                <p className="text-black mb-2"><strong>Date Issued:</strong> June 15, 2024</p>
                            </div>
                            <p className="text-black mb-2"><strong>Service:</strong> Advisory Session</p>
                            <p className="text-black mb-2"><strong>Client Name:</strong> John Doe</p>
                            <p className="text-black mb-2"><strong>Advisor:</strong> Advisor Name</p>
                            <p className="text-black mb-2"><strong>Amount:</strong> $150.00</p>
                            <p className="text-black mb-2"><strong>Status:</strong> Paid</p>
                        </div>
                        
                    </div>
        </main>
    );
}