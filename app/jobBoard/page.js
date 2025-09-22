import { headers } from "next/headers";
import JobClient from "./JobClient";

export default async function JobBoardPage() {

  // Builder absolute URL for this request (works in dev, prod, Vercel, proxies)
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const baseUrl = `${protocol}://${host}`;
  console.log("Base URL (inside page):", baseUrl);

  // Fetch jobs via API (server-side)
  let jobs = [];
  try {
    const res = await fetch(`${baseUrl}/api/job`, { cache: "no-store" });
    if (res.ok) {
      jobs = await res.json();
    } else {
      console.error("Failed to fetch jobs, status:", await res.text());
    }
  } catch (err) {
    console.error("Error fetching jobs:", err);
  }

  return <JobClient jobs={jobs} />;
}
