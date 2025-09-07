"use client";

import Navbar from "../components/MemberNavBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function PageContent() {


    return (
        <div>
            <Navbar />
            <main className="bg-gray-100 min-h-screen">
                <div class="flex justify-center">
                    <div class="flex items-center border border-black rounded-xl overflow-hidden py-1 pr-2 mt-4">
                        <input 
                        type="text" 
                        placeholder="What to learn?" 
                        class="px-3 py-2 w-64 focus:outline-none placeholder-black"
                        />
                        <button class="bg-[#F26D51] text-white px-3 py-1 rounded-lg">Search</button>
                        <button class="bg-[#F26D51] text-white px-3 py-1 ml-2 rounded-lg">Advanced Search</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function Page() {
  return (
    <PageContent />
  );
}
