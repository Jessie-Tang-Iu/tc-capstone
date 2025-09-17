import { headers } from "next/headers";
import ApplicationClient from "./ApplicationClient";


export default async function Applications() {
    const userId = 22222; // Replace with actual user ID

    // Builder absolute URL for this request (works in dev, prod, Vercel, proxies)
    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto") ?? "http";
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const baseUrl = `${protocol}://${host}`;
    console.log("Base URL (inside page):", baseUrl);

    // Fetch via your API
    let applications = [];
    try {
        const res = await fetch(`${baseUrl}/api/application/user/${userId}`, { cache: "no-store" });
        if (res.ok) {
            applications = await res.json();
        } else {
            console.error("Failed to fetch applications, status:", await res.text());
        }
    } catch (err) {
        console.error("Error fetching applications:", err);
    }
    console.log("Fetched applications:", applications);

    return (
        // <div className="min-h-screen bg-gray-100">
        //     <MemberNavBar />
      
        //     <div className="pt-7 mb-3 md:mb-8 mx-5 md:mx-8">
        //       <h1 className="text-2xl md:text-3xl font-bold text-black">
        //         My Applications
        //       </h1>
        //       <p className="text-sm md:text-base text-gray-600 mt-1">
        //         Track the jobs you have applied for.
        //       </p>
        //     </div>

        //     {/* Main Content */}

        // </div>
        <ApplicationClient userId={userId} applications={applications} />
    );
}
